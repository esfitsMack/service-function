import { File } from '@asyncapi/generator-react-sdk';

export default function localSettings({ asyncapi, params }) {
    //get the channel...should always be publish
    let subChannel;
    for (let channel of Object.values(asyncapi.channels())){
        if (channel.hasPublish){
            subChannel = channel
        }
    }
    //get the function type and if needed the verb blocks for the http type.
    let xfunction = subChannel.ext("x-function");
    let connection = xfunction.connection;
    if (connection){
      if(connection !== "null" || connection !== "" ){
        connection = ",\r\n            " + "\"" + connection + "\":\"\"";
      }
      else{ 
        connection = "CONNSTR";
      }
    }
    else{ 
      connection = "CONNSTR";
    }
  return <File name={'local.settings.json'}>
    {
      `
    {
      "IsEncrypted": false,
      "Values": {
          "AzureWebJobsStorage": "UseDevelopmentStorage=true",
          "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
          "ITFERRORSEND": "",
          "${connection}": "",
          "EVENTHUBSEND": "",
          "ITFDATACONNECTION": ""
      }
    }
    `
    }
  </File>;
}
