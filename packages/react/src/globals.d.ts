// Ambient TypeScript declarations for CSS Modules.
// Lets components do `import styles from "./Foo.module.css"` and get
// a typed object of class-name strings back.

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
