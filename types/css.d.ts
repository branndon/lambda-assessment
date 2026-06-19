// Ambient wildcard declaration for plain CSS side-effect imports.
// Must live in a file with no top-level import/export statements so
// TypeScript treats it as a global ambient file — wildcard patterns
// (*.css) only work in ambient files, not in module declaration files.
declare module '*.css';
