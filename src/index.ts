import { Plugin, normalizePath } from 'vite';
import * as path from 'path';
import { IGenerateCodeProps, Options } from './index.type';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import * as prettier from 'prettier';
import { traverse, parseSync, types as t } from '@babel/core';
import generator from '@babel/generator';
import fg from 'fast-glob';
import { red } from 'chalk';

function vitePluginWatchI18(userOptions: Options = {}): Plugin {
  return {
    name: 'vite-plugin-watch-i18',
    async handleHotUpdate(ctx) {
      const fileCode = await ctx.read();
      const {
        funName = 't',
        splitCode = '#',
        languageDir = ['locale/zh-CN', 'locale/en-US'],
        include = ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
      } = userOptions;

      const filePath = ctx.file;
      const allFile = await fg(include);
      if (!allFile.some((i) => path.resolve(i) === filePath)) {
        return;
      }
      const isTs = /^.+\.(ts|tsx)$/.test(ctx.file);

      generateCodeWithFile({
        funName,
        splitCode,
        fileCode,
        isTs,
        languageDir,
        filePath: normalizePath(path.resolve(filePath)),
      });
    },
  };
}

const generateCodeWithFile = ({
  funName,
  fileCode,
  filePath,
  isTs,
  splitCode,
  languageDir,
}: IGenerateCodeProps) => {
  const { code, localeInfo, localeFileNameArr, isHaveI18nFun } = parseSourceFile({
    filePath,
    fileCode,
    funName,
    isTs,
    splitCode,
    langLength: languageDir.length,
  });

  if (!isHaveI18nFun) {
    return;
  }

  try {
    languageDir.forEach((v, index) => {
      writeLocale({
        localeDir: normalizePath(v),
        localeFileNameArr,
        isTs,
        localeInfo: localeInfo.map((info) => ({
          path: info[0].split('.'),
          value: info[index + 1],
        })),
      });
    });
    const formatCode = prettier.format(code, { parser: 'typescript' });
    const formatOriginCode = prettier.format(fileCode, { parser: 'typescript' });
    formatCode !== formatOriginCode && writeFile(filePath, code);
  } catch (error) {
    console.trace(red(error));
  }
};

const parseSourceFile = ({
  filePath,
  fileCode,
  funName,
  isTs,
  splitCode,
  langLength,
}: {
  filePath: string;
  fileCode: string;
  funName: string;
  isTs: boolean;
  splitCode: string;
  langLength: number;
}) => {
  let isHaveI18nFun = false;
  const ast = isTs
    ? parseSync(fileCode, {
        presets: [require('@babel/preset-typescript').default],
        filename: filePath,
      })
    : parseSync(fileCode, {});

  const localeInfo: string[] = [];
  const localeFileNameArr: string[] = [];
  let index = 0;
  traverse(ast, {
    CallExpression(_path) {
      let isFun = false;
      const { node } = _path;
      if (node.callee.type === 'Identifier') {
        isFun = node.callee.name === funName;
      } else if (node.callee.type === 'MemberExpression') {
        isFun = (node.callee.property as any).name === funName;
      }
      if (isFun) {
        const arg = (node.arguments[0] as any).value;
        if (!arg.includes(splitCode) || arg.split(splitCode).length !== langLength + 1) {
          return;
        }
        isHaveI18nFun = isFun;
        localeInfo.push(arg.split(splitCode));
        localeFileNameArr.push(arg.split('.')[0]);
        const replaceArgs = node.arguments.slice() as any;
        replaceArgs[0].value = localeInfo[index][0];
        _path.replaceWith(t.callExpression(node.callee, replaceArgs));
        _path.skip();
        index++;
      }
    },
  });

  return {
    code: !!ast ? generator(ast, { jsescOption: { minimal: true } })?.code ?? '' : '',
    localeInfo,
    localeFileNameArr,
    isHaveI18nFun,
  };
};

const writeLocale = ({
  localeDir,
  localeFileNameArr,
  isTs,
  localeInfo,
}: {
  localeDir: string;
  localeFileNameArr: string[];
  isTs: boolean;
  localeInfo: Array<{ path: string[]; value: string }>;
}) => {
  groupBy(localeFileNameArr).forEach((fileName) => {
    let localPath = path.resolve(path.join('src', localeDir), fileName);

    if (isTs) {
      localPath = localPath + '.ts';
    } else {
      localPath = localPath + '.js';
    }
    let code;
    const isExistLocalFile = existsSync(localPath);
    if (isExistLocalFile) {
      code = readFileSync(localPath, 'utf-8') || `export default {}`;
    } else {
      code = `export default {}`;
    }
    const ast = isTs
      ? parseSync(code, {
          presets: [require('@babel/preset-typescript').default],
          filename: localPath,
        })
      : parseSync(code, {});
    traverse(ast, {
      ExportDefaultDeclaration(_path) {
        const { node } = _path;
        const properties = assemblyLocaleObj(
          (node.declaration as any).properties,
          localeInfo
            .filter((f) => f.path[0] === fileName)
            .map((m) => ({ path: m.path.slice(1), value: m.value })),
        );
        _path.replaceWith(t.exportDefaultDeclaration(t.objectExpression(properties)));
        _path.skip();
      },
    });

    writeFile(
      localPath,
      !!ast
        ? generator(ast, {
            // https://www.wwwbuild.net/IPyhon/893.html
            jsescOption: { minimal: true },
          })?.code
        : '',
    );

    if (!isExistLocalFile) {
      addLocaleImport({ localeDir, fileName, isTs });
    }
  });
};

const assemblyLocaleObj = (origin: any, localeInfo: Array<{ path: string[]; value: string }>) => {
  const addProp = (objPath: string[], value: string, originAst = []) => {
    if (objPath.length === 1) {
      const existProp: any = originAst.find((o: any) => o.key.name === objPath[0]);
      if (existProp?.value?.type === 'StringLiteral') {
        originAst.forEach((o: any) => {
          if (o.key.name === objPath[0]) {
            o.value.value = value;
          }
        });
        return originAst;
      }

      if (existProp?.value?.type === 'ObjectExpression') {
        throw new Error('ERROR: There are duplicates in the language pack, please check the data!');
      }
      const item = t.objectProperty(t.identifier(objPath[0]), t.stringLiteral(value));
      return [...originAst, item];
    }

    if (originAst.some((o: any) => o.key.name === objPath[0])) {
      const existProp: any = originAst.find((o: any) => o.key.name === objPath[0]);
      if (existProp?.value?.type !== 'ObjectExpression') {
        throw new Error('ERROR: There are duplicates in the language pack, please check the data!');
      }
      const item = addProp(objPath.slice(1), value, existProp.value.properties);
      const tmp = originAst.slice();
      tmp.forEach((o: any) => {
        if (o.key.name === objPath[0]) {
          o.value.properties = item;
        }
      });
      return tmp;
    }
    const ast = t.objectProperty(
      t.identifier(objPath[0]),
      t.objectExpression(addProp(objPath.slice(1), value)),
    );
    return [...originAst, ast];
  };
  let properties = Array.isArray(origin) ? origin.slice() : origin;
  localeInfo.forEach((info) => {
    properties = addProp(info.path, info.value, properties);
  });
  return properties;
};

const addLocaleImport = ({ localeDir, fileName, isTs }: any) => {
  try {
    const root = isTs
      ? path.resolve(path.join('src', localeDir), 'index.ts')
      : path.resolve(path.join('src', localeDir), 'index.js');

    if (!existsSync(root)) {
      throw new Error('The default export language pack file was not found!');
    }

    const code = readFileSync(root, 'utf-8') || `export default {translation:{}}`;
    const ast = isTs
      ? parseSync(code, {
          presets: [require('@babel/preset-typescript').default],
          filename: root,
        })
      : parseSync(code, {});
    traverse(ast, {
      Program(_path) {
        _path.unshiftContainer(
          'body',
          t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier(fileName))],
            t.stringLiteral(`./${fileName}`),
          ),
        );
      },
      ExportDefaultDeclaration(_path) {
        const properties = (_path.node.declaration as any).properties.slice();
        properties[0].value.properties.push(
          t.objectProperty(t.identifier(fileName), t.identifier(fileName)),
        );
        _path.replaceWith(t.exportDefaultDeclaration(t.objectExpression(properties)));
        _path.skip();
      },
    });
    writeFile(root, !!ast ? generator(ast, { jsescOption: { minimal: true } })?.code ?? '' : '');
  } catch (error) {
    console.trace(red(error));
  }
};

const groupBy = (arr: string[]) => {
  return arr.reduce((acc: string[], crr) => {
    return acc.includes(crr) ? acc : [...acc, crr];
  }, []);
};

const writeFile = (pathFile: string, code: string) => {
  try {
    const file = prettier.format(code, {
      parser: 'typescript',
      tabWidth: 2,
      semi: true,
      printWidth: 80,
      trailingComma: 'all',
      arrowParens: 'always',
      proseWrap: 'preserve',
      useTabs: false,
      singleQuote: true,
      bracketSpacing: true,
      jsxBracketSameLine: false,
    });
    writeFileSync(pathFile, file);
  } catch (error) {
    console.error(error);
  }
};

export default vitePluginWatchI18;
