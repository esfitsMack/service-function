import { File } from '@asyncapi/generator-react-sdk';
import getLaunchSettings from '../../../components/launch';

export default function publishFile({ asyncapi, originalAsyncAPI }) {

let subChannel;
for (let channel of Object.values(asyncapi.channels())){
  if (channel.hasPublish){
    subChannel = channel
  }
}
let xfunction = subChannel.ext("x-function");
let type = xfunction.type;
let launchsettings = getLaunchSettings(type);

    return <File name={`launchSettings.json`}>
    {
    `
        ${launchsettings}
    `
    }
  </File>;
}