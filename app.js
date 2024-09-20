const { readFile } = require('fs');

function searchHistory(query) {
  // Path to the zsh history file
  const historyFilePath = process.env.HOME + '/.zsh_history';

  // Read the zsh history file
  readFile(historyFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading zsh history file: ${err.message}`);
      return;
    }

    // Split the history content into an array of commands
    const history = data.split('\n').reverse();

    // Use a regular expression to extract the command part
    const commandRegex = /^(.+)/;

    // Search for the query in the history
    const matchingCommands = history
      .map(line => line.match(commandRegex))
      .filter(match => match && match[1].includes(query))
      .map(match => match[1]);

    if (matchingCommands.length > 0) {
      //console.log('Matching commands in history:');
      
      console.log(JSON.stringify({
        "items": matchingCommands.map(command => ({
          title: `${command.split(';')[1]}`,
          subtitle: `...`,
          valid: true,
          arg: `${command.split(';')[1]}`,
          icon: { path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertCautionIcon.icns" }
        }))
      }));

    } else {
      //console.log(`No matching commands found for "${query}"`);

      console.log(JSON.stringify({
        "items": [{
          title: query,
          subtitle: `...`,
          valid: true,
          arg: query,
          icon: { path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertCautionIcon.icns" }
        }]
      }));
    }
  });
}

// Example usage
const searchTerm = process.argv[2]; // Get the search term from command line arguments
searchHistory(searchTerm || ''); // If no search term is provided, default to an empty string
