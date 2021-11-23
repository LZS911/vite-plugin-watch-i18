"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var vite_1 = require("vite");
var path = require("path");
var fs_1 = require("fs");
var prettier = require("prettier");
var core_1 = require("@babel/core");
var generator_1 = require("@babel/generator");
var fg = require("fast-glob");
var chalk_1 = require("chalk");
function vitePluginWatchI18(userOptions) {
    if (userOptions === void 0) { userOptions = {}; }
    return {
        name: 'vite-plugin-watch-i18',
        handleHotUpdate: function (ctx) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var fileCode, _c, funName, _d, splitCode, _e, languageDir, _f, include, filePath, allFile, pkg, isTs;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, ctx.read()];
                        case 1:
                            fileCode = _g.sent();
                            _c = userOptions.funName, funName = _c === void 0 ? 't' : _c, _d = userOptions.splitCode, splitCode = _d === void 0 ? '#' : _d, _e = userOptions.languageDir, languageDir = _e === void 0 ? ['locale/zh-CN', 'locale/en-US'] : _e, _f = userOptions.include, include = _f === void 0 ? ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'] : _f;
                            filePath = ctx.file;
                            return [4 /*yield*/, fg(include)];
                        case 2:
                            allFile = _g.sent();
                            if (!allFile.some(function (i) { return path.resolve(i) === filePath; })) {
                                return [2 /*return*/];
                            }
                            pkg = require(path.resolve('package.json'));
                            isTs = Object.keys(__assign(__assign({}, ((_a = pkg === null || pkg === void 0 ? void 0 : pkg.dependencies) !== null && _a !== void 0 ? _a : {})), ((_b = pkg === null || pkg === void 0 ? void 0 : pkg.devDependencies) !== null && _b !== void 0 ? _b : {}))).includes('typescript');
                            generateCodeWithFile({
                                funName: funName,
                                splitCode: splitCode,
                                fileCode: fileCode,
                                isTs: isTs,
                                languageDir: languageDir,
                                filePath: (0, vite_1.normalizePath)(path.resolve(filePath))
                            });
                            return [2 /*return*/];
                    }
                });
            });
        }
    };
}
var generateCodeWithFile = function (_a) {
    var funName = _a.funName, fileCode = _a.fileCode, filePath = _a.filePath, isTs = _a.isTs, splitCode = _a.splitCode, languageDir = _a.languageDir;
    var _b = parseSourceFile({
        filePath: filePath,
        fileCode: fileCode,
        funName: funName,
        isTs: isTs,
        splitCode: splitCode,
        langLength: languageDir.length
    }), code = _b.code, localeInfo = _b.localeInfo, localeFileNameArr = _b.localeFileNameArr;
    languageDir.forEach(function (v, index) {
        writeLocale({
            localeDir: (0, vite_1.normalizePath)(v),
            localeFileNameArr: localeFileNameArr,
            isTs: isTs,
            localeInfo: localeInfo.map(function (info) { return ({
                path: info[0].split('.'),
                content: info[index + 1]
            }); })
        });
    });
    var formatCode = prettier.format(code, { parser: 'typescript' });
    var formatOriginCode = prettier.format(fileCode, { parser: 'typescript' });
    formatCode !== formatOriginCode && writeFile(filePath, code);
};
var parseSourceFile = function (_a) {
    var _b, _c;
    var filePath = _a.filePath, fileCode = _a.fileCode, funName = _a.funName, isTs = _a.isTs, splitCode = _a.splitCode, langLength = _a.langLength;
    var ast = isTs
        ? (0, core_1.parseSync)(fileCode, {
            presets: [require('@babel/preset-typescript')["default"]],
            filename: filePath
        })
        : (0, core_1.parseSync)(fileCode, {});
    var localeInfo = [];
    var localeFileNameArr = [];
    var index = 0;
    (0, core_1.traverse)(ast, {
        CallExpression: function (_path) {
            var isFun = false;
            var node = _path.node;
            if (node.callee.type === 'Identifier') {
                isFun = node.callee.name === funName;
            }
            else if (node.callee.type === 'MemberExpression') {
                isFun = node.callee.property.name === funName;
            }
            if (isFun) {
                var arg = node.arguments[0].value;
                if (!arg.includes(splitCode) || arg.split(splitCode).length !== langLength + 1) {
                    return;
                }
                localeInfo.push(arg.split(splitCode));
                localeFileNameArr.push(arg.split('.')[0]);
                var replaceArgs = node.arguments.slice();
                replaceArgs[0].value = localeInfo[index][0];
                _path.replaceWith(core_1.types.callExpression(node.callee, replaceArgs));
                _path.skip();
                index++;
            }
        }
    });
    return {
        code: !!ast ? (_c = (_b = (0, generator_1["default"])(ast, { jsescOption: { minimal: true } })) === null || _b === void 0 ? void 0 : _b.code) !== null && _c !== void 0 ? _c : '' : '',
        localeInfo: localeInfo,
        localeFileNameArr: localeFileNameArr
    };
};
var writeLocale = function (_a) {
    var localeDir = _a.localeDir, localeFileNameArr = _a.localeFileNameArr, isTs = _a.isTs, localeInfo = _a.localeInfo;
    groupBy(localeFileNameArr).forEach(function (fileName) {
        var _a;
        var localPath = path.resolve(path.join('src', localeDir), fileName);
        if (isTs) {
            localPath = localPath + '.ts';
        }
        else {
            localPath = localPath + '.js';
        }
        var code;
        var isExistLocalFile = (0, fs_1.existsSync)(localPath);
        if (isExistLocalFile) {
            code = (0, fs_1.readFileSync)(localPath, 'utf-8') || "export default {}";
        }
        else {
            code = "export default {}";
        }
        var ast = isTs
            ? (0, core_1.parseSync)(code, {
                presets: [require('@babel/preset-typescript')["default"]],
                filename: localPath
            })
            : (0, core_1.parseSync)(code, {});
        (0, core_1.traverse)(ast, {
            ExportDefaultDeclaration: function (_path) {
                var node = _path.node;
                var properties = assemblyLocaleObj(node.declaration.properties, localeInfo
                    .filter(function (f) { return f.path[0] === fileName; })
                    .map(function (m) { return ({ path: m.path.slice(1), content: m.content }); }));
                _path.replaceWith(core_1.types.exportDefaultDeclaration(core_1.types.objectExpression(properties)));
                _path.skip();
            }
        });
        writeFile(localPath, !!ast
            ? (_a = (0, generator_1["default"])(ast, {
                // https://www.wwwbuild.net/IPyhon/893.html
                jsescOption: { minimal: true }
            })) === null || _a === void 0 ? void 0 : _a.code
            : '');
        if (!isExistLocalFile) {
            addLocaleImport({ localeDir: localeDir, fileName: fileName, isTs: isTs });
        }
    });
};
var assemblyLocaleObj = function (origin, localeInfo) {
    var addProp = function (objPath, content, originAst) {
        var _a, _b, _c;
        if (originAst === void 0) { originAst = []; }
        if (objPath.length === 1) {
            var existProp = originAst.find(function (o) { return o.key.name === objPath[0]; });
            if (((_a = existProp === null || existProp === void 0 ? void 0 : existProp.value) === null || _a === void 0 ? void 0 : _a.type) === 'StringLiteral') {
                originAst.forEach(function (o) {
                    if (o.key.name === objPath[0]) {
                        o.value.value = content;
                    }
                });
                return originAst;
            }
            if (((_b = existProp === null || existProp === void 0 ? void 0 : existProp.value) === null || _b === void 0 ? void 0 : _b.type) === 'ObjectExpression') {
                console.error((0, chalk_1.red)('ERROR: There are duplicates in the language pack, please check the data!'));
                return originAst;
            }
            var item = core_1.types.objectProperty(core_1.types.identifier(objPath[0]), core_1.types.stringLiteral(content));
            return __spreadArray(__spreadArray([], originAst, true), [item], false);
        }
        if (originAst.some(function (o) { return o.key.name === objPath[0]; })) {
            var existProp = originAst.find(function (o) { return o.key.name === objPath[0]; });
            if (((_c = existProp === null || existProp === void 0 ? void 0 : existProp.value) === null || _c === void 0 ? void 0 : _c.type) !== 'ObjectExpression') {
                console.error((0, chalk_1.red)('ERROR: There are duplicates in the language pack, please check the data!'));
                return originAst;
            }
            var item_1 = addProp(objPath.slice(1), content, existProp.value.properties);
            var tmp = originAst.slice();
            tmp.forEach(function (o) {
                if (o.key.name === objPath[0]) {
                    o.value.properties = item_1;
                }
            });
            return tmp;
        }
        else {
            var ast = core_1.types.objectProperty(core_1.types.identifier(objPath[0]), core_1.types.objectExpression(addProp(objPath.slice(1), content)));
            return __spreadArray(__spreadArray([], originAst, true), [ast], false);
        }
    };
    var properties = Array.isArray(origin) ? origin.slice() : origin;
    localeInfo.forEach(function (info) {
        properties = addProp(info.path, info.content, properties);
    });
    return properties;
};
var addLocaleImport = function (_a) {
    var _b, _c;
    var localeDir = _a.localeDir, fileName = _a.fileName, isTs = _a.isTs;
    var root = isTs
        ? path.resolve(path.join('src', localeDir), 'index.ts')
        : path.resolve(path.join('src', localeDir), 'index.js');
    if (!(0, fs_1.existsSync)(root)) {
        console.error('The default export language pack file was not found!');
        process.exit(1);
    }
    var code = (0, fs_1.readFileSync)(root, 'utf-8');
    var ast = isTs
        ? (0, core_1.parseSync)(code, {
            presets: [require('@babel/preset-typescript')["default"]],
            filename: root
        })
        : (0, core_1.parseSync)(code, {});
    (0, core_1.traverse)(ast, {
        Program: function (_path) {
            _path.unshiftContainer('body', core_1.types.importDeclaration([core_1.types.importDefaultSpecifier(core_1.types.identifier(fileName))], core_1.types.stringLiteral("./".concat(fileName))));
        },
        ExportDefaultDeclaration: function (_path) {
            var properties = _path.node.declaration.properties.slice();
            properties[0].value.properties.push(core_1.types.objectProperty(core_1.types.identifier(fileName), core_1.types.identifier(fileName)));
            _path.replaceWith(core_1.types.exportDefaultDeclaration(core_1.types.objectExpression(properties)));
            _path.skip();
        }
    });
    writeFile(root, !!ast ? (_c = (_b = (0, generator_1["default"])(ast, { jsescOption: { minimal: true } })) === null || _b === void 0 ? void 0 : _b.code) !== null && _c !== void 0 ? _c : '' : '');
};
var groupBy = function (arr) {
    return arr.reduce(function (acc, crr) {
        return acc.includes(crr) ? acc : __spreadArray(__spreadArray([], acc, true), [crr], false);
    }, []);
};
var writeFile = function (pathFile, content) {
    try {
        var file = prettier.format(content, {
            parser: 'typescript',
            tabWidth: 2,
            semi: true,
            printWidth: 80,
            trailingComma: 'none',
            arrowParens: 'avoid',
            proseWrap: 'preserve',
            useTabs: false,
            singleQuote: true,
            bracketSpacing: true,
            jsxBracketSameLine: false
        });
        (0, fs_1.writeFileSync)(pathFile, file);
    }
    catch (error) {
        console.error(error);
    }
};
exports["default"] = vitePluginWatchI18;
