import { File } from '@asyncapi/generator-react-sdk';

export default function hostFile({ asyncapi }) {
  return <File name={'host.json'}>
    {
      `
      {
        "version": "2.0",
        "logging": {
            "applicationInsights": {
                "samplingSettings": {
                    "isEnabled": true,
                    "excludedTypes": "Request"
                }
            }
        }
    }
    `
    }
  </File>;
}