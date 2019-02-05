import createMuiTheme, {
  ThemeOptions
} from "@material-ui/core/styles/createMuiTheme";

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    fileDrawer: {
      width: React.CSSProperties["width"];
    };
    gitDrawer: {
      height: React.CSSProperties["height"];
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    fileDrawer?: {
      width?: React.CSSProperties["width"];
    };
    gitDrawer?: {
      height?: React.CSSProperties["width"];
    };
  }
}

export default function createMyTheme(options: ThemeOptions) {
  return createMuiTheme({
    fileDrawer: {
      width: 200
    },
    gitDrawer: {
      height: 250
    },
    ...options
  });
}
