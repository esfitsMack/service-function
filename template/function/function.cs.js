import { File } from '@asyncapi/generator-react-sdk';
import { pascalCase, funcName, className } from '../../utils/general';
import getTriggerBlock from '../../components/triggers';
import getVerbBlock from '../../components/verbs';
import getImportsBlock from '../../components/imports';

export default function publishFile({ asyncapi, originalAsyncAPI }) {

    var namespace = asyncapi.info().title();
    var classname = className(namespace);
    var funcname = funcName(namespace);
    //get the channel...should always be publish
    let subChannel;
    for (let channel of Object.values(asyncapi.channels())){
        if (channel.hasPublish){
            subChannel = channel
        }
    }
    //get the function type and if needed the verb blocks for the http type.
    let xfunction = subChannel.ext("x-function");
    let type = xfunction.type;
    let triggername = xfunction.trigger;
    let connection = xfunction.connection;
    //do we need verb blocks?
    let verbBlocks="";
    if (type === "http"){
        let functionname = "default";
        let verb = "post";
        let route = null;
        let ops = subChannel.ext("x-operations");
        if (ops !== undefined){
            for (var i = 0; i < ops.length; i++){
                functionname = ops[i].name;
                verb = ops[i].verb;
                route = ops[i].route;
                verbBlocks += getVerbBlock(verb, functionname, route) + "\r\n        ";
            }
        }
    }

    let imports = getImportsBlock(type) + "\r\n";
    let trigger = getTriggerBlock(type, triggername, connection, namespace, classname, funcname, verbBlocks);

    return <File name={`${pascalCase(namespace)}.cs`}>
    {
    `
${imports}
${trigger}
    `
    }
  </File>;
}
