const { resp } = require('../util');

module.exports = {
  command: 'reload',
  description: 'Reload a plugin/theme',
  usage: '{c} [ plugin/theme ID ]',
  executor ([ id ]) {
    const isPlugin = powercord.pluginManager.plugins.has(id);
    const isTheme = powercord.styleManager.themes.has(id);

    if (!isPlugin && !isTheme) { // No match
      return resp(false, `Could not find plugin or theme matching "${id}".`);
    } else if (isPlugin && isTheme) { // Duplicate name
      return resp(false, `"${id}" is in use by both a plugin and theme. You will have to reload it from settings.`);
    }

    const manager = isPlugin ? powercord.pluginManager : powercord.styleManager;

    manager.remount(id);
    return resp(true, `${isPlugin ? 'Plugin' : 'Theme'} "${id}" reloaded!`);
  },

  autocomplete (args) {
    const plugins = Array.from(powercord.pluginManager.plugins.values())
      .filter(plugin =>
        plugin.entityID.toLowerCase().includes(args[0]?.toLowerCase())
      );

    const themes = Array.from(powercord.styleManager.themes.values())
      .filter(theme =>
        theme.entityID.toLowerCase().includes(args[0]?.toLowerCase())
      );

    if (args.length > 1) {
      return false;
    }

    return {
      header: 'replugged entities list',
      commands: [
        ...plugins.map(plugin => ({
          command: plugin.entityID,
          description: `Plugin - ${plugin.manifest.description}`
        })),
        ...themes.map(theme => ({
          command: theme.entityID,
          description: `Theme - ${theme.manifest.description}`
        }))
      ]
    };
  }
};
