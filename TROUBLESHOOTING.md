# Troubleshooting Installation Issues

## Node-sass Installation Errors

If you encounter issues with node-sass during installation, try one of the following solutions:

### Solution 1: Use Dart Sass Instead (Recommended)

Node-sass is deprecated. It's recommended to use Dart Sass instead:

1. Remove node-sass from your dependencies:
   ```
   npm uninstall node-sass
   ```

2. Install sass instead:
   ```
   npm install sass --save-dev
   ```

3. Update your imports in SCSS files if necessary (usually not needed)

### Solution 2: Install Python Dependencies

Node-sass requires Python and specific modules for compilation:

```
pip3 install setuptools
```

### Solution 3: Use Node Version Manager (nvm)

Try using an LTS version of Node:

```
nvm install 18
nvm use 18
npm install
```

### Solution 4: Force Install with Legacy Peer Dependencies

```
npm install --legacy-peer-deps
```

## Common React Dependency Warnings

The dependency warnings you're seeing with React packages are due to version mismatches between your React version (18.3.1) and the peer dependencies of various packages. These warnings can often be ignored when using the `--force` or `--legacy-peer-deps` flag.
