/**
 * Command Parser
 * Parse "/commandName" and arguments of the command from message.body
 * */
export const commandParser = (cmd: string) => {
  const command = cmd.split(' ')[0];
  const args = cmd.split(' ').splice(1);

  return {
    command,
    args,
  };
};
