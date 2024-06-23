import * as Docker from 'dockerode';
import * as cron from 'node-cron';

export const docker = new Docker();

const removeContainers = async () => {
  console.log('Removing container');
  await docker.pruneContainers();
};

cron.schedule('* * * * *', removeContainers);
