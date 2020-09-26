/* eslint-disable import/prefer-default-export */
export function capitalizeFirstLetterOfCapitalized(string) {
  const str = string.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getRoundInfo(playerType, playerTeam, gameStatus) {
  if (playerType === 'SPECTATOR') {
    if (gameStatus === 'RED_TEAM_SPYMASTER_ROUND') return 'Red spymaster is playing. (You are not in a team yet.)';
    if (gameStatus === 'RED_TEAM_OPERATIVE_ROUND') return 'Red operatives are playing. (You are not in a team yet.)';
    if (gameStatus === 'BLUE_TEAM_SPYMASTER_ROUND') return 'Blue spymaster is playing. (You are not in a team yet.)';
    if (gameStatus === 'BLUE_TEAM_OPERATIVE_ROUND') return 'Blue operatives are playing. (You are not in a team yet.)';
  } else if (playerType === 'OPERATIVE') {
    if (playerTeam === 'RED') {
      if (gameStatus === 'RED_TEAM_SPYMASTER_ROUND') return 'Wait for your spymasters to give you a clue...';
      if (gameStatus === 'RED_TEAM_OPERATIVE_ROUND') return 'Try to guess a word.';
      if (gameStatus === 'BLUE_TEAM_SPYMASTER_ROUND') return 'The opponent spymaster is playing, wait for your turn...';
      if (gameStatus === 'BLUE_TEAM_OPERATIVE_ROUND') return 'The opponent operatives are playing, wait for your turn...';
    } else {
      if (gameStatus === 'BLUE_TEAM_SPYMASTER_ROUND') return 'Wait for your spymasters to give you a clue...';
      if (gameStatus === 'BLUE_TEAM_OPERATIVE_ROUND') return 'Try to guess a word.';
      if (gameStatus === 'RED_TEAM_SPYMASTER_ROUND') return 'The opponent spymaster is playing, wait for your turn...';
      if (gameStatus === 'RED_TEAM_OPERATIVE_ROUND') return 'The opponent operatives are playing, wait for your turn...';
    }
  } else if (playerTeam === 'RED') {
    if (gameStatus === 'RED_TEAM_SPYMASTER_ROUND') return 'Give your operatives a clue.';
    if (gameStatus === 'RED_TEAM_OPERATIVE_ROUND') return 'Your operatives are guessing now...';
    if (gameStatus === 'BLUE_TEAM_SPYMASTER_ROUND') return 'The opponent spymaster is playing, wait for your turn...';
    if (gameStatus === 'BLUE_TEAM_OPERATIVE_ROUND') return 'The opponent operatives are playing, wait for your turn...';
  } else {
    if (gameStatus === 'BLUE_TEAM_SPYMASTER_ROUND') return 'Give your operatives a clue.';
    if (gameStatus === 'BLUE_TEAM_OPERATIVE_ROUND') return 'Your operatives are guessing now...';
    if (gameStatus === 'RED_TEAM_SPYMASTER_ROUND') return 'The opponent spymaster is playing, wait for your turn...';
    if (gameStatus === 'RED_TEAM_OPERATIVE_ROUND') return 'The opponent operatives are playing, wait for your turn...';
  }
  return gameStatus;
}
