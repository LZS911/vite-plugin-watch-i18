import { PluginOption } from 'vite';

interface Options {
  funName?: string;
  splitCode?: string;
  languageDir?: string[];
  include?: string[];
}

interface IGenerateCodeProps {
  funName: string;
  splitCode: string;
  languageDir: string[];
  filePath: string;
  fileCode: string;
  isTs: boolean;
}

export { IGenerateCodeProps, Options };

declare function viteWatchI18(opts?: Options): PluginOption[];

declare namespace viteWatchI18 {
  var preambleCode: string;
}
export default viteWatchI18;
