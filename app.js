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

    const matchingCommands = history
    .map(line => {
      // Split each line at the semicolon
      const parts = line.split(';');
      if (parts.length > 1) {
        const command = parts[1].trim();  // Trim any extra whitespace
        if (!command.includes('node app.js ssh demo5') ){
         return command;  // Return the command part
        }
      }
      return null;  // Return null for lines that don't have a command part
    })
    .filter(command => command && command.includes(query));  // Only include valid commands that match the query
  
    // Remove duplicates
    const uniqueMatchingCommands = matchingCommands.filter((command, index, self) => {
      return self.indexOf(command) === index;
    });

    //console.log(uniqueMatchingCommands)
  

    if (uniqueMatchingCommands.length > 0) {
      //console.log('Matching commands in history:');
      
      console.log(JSON.stringify({
        "items": uniqueMatchingCommands.map(command => ({
          title: `${command}`,
          subtitle: ``,
          valid: true,
          arg: `${command}`,
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
const searchTerm = process.argv.slice(2).join(" ");
 // Get the search term from command line arguments
searchHistory(searchTerm || ''); // If no search term is provided, default to an empty string
