import { File } from '@asyncapi/generator-react-sdk';
import getProgramBlock from '../../components/program';

export default function publishFile({ asyncapi }) {

let subChannel;
for (let channel of Object.values(asyncapi.channels())){
  if (channel.hasPublish){
    subChannel = channel
  }
}
let type = subChannel.ext("x-function").type;
let content = getProgramBlock(type);

  return <File name={`Program.cs`}>
    {
    `
        ${content}
    `
    }
  </File>;
}
