import { File } from '@asyncapi/generator-react-sdk';
import getItemGroupBlock from '../../components/project';

export default function pubsubeventhub({ asyncapi }) {
  const projectName = asyncapi.info().title();
  let subChannel;
  for (let channel of Object.values(asyncapi.channels())){
    if (channel.hasPublish){
      subChannel = channel
    }
  }
  let xfunction = subChannel.ext("x-function");
  let type = xfunction.type;
  const itemGroupBlock = getItemGroupBlock(type);
  return <File name={`${projectName}.csproj`}>
    {`
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
    <OutputType>Exe</OutputType>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
<ItemGroup>
  ${itemGroupBlock}
</ItemGroup>
<ItemGroup>
  <None Update="host.json">
    <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
  </None>
  <None Update="local.settings.json">
    <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    <CopyToPublishDirectory>Never</CopyToPublishDirectory>
  </None>
</ItemGroup>
  <ItemGroup>
    <Using Include="System.Threading.ExecutionContext" Alias="ExecutionContext" />
  </ItemGroup>
</Project>`
    }
  </File>;
}
