import { File, render } from '@asyncapi/generator-react-sdk';


export default function publishFile({ asyncapi, originalAsyncAPI }) {
    var projectName = asyncapi.info().title();
    let subChannel;
    for (let channel of Object.values(asyncapi.channels())){
        if (channel.hasPublish){
            subChannel = channel
        }
    }
    //get the function type and if needed the verb blocks for the http type.
    let gencontainerscript = subChannel.ext("x-containerapp"); 

    if(gencontainerscript){
      return <File name={`Dockerfile`}>
      {
      ` #See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.
        FROM mcr.microsoft.com/azure-functions/dotnet-isolated:4-dotnet-isolated8.0 AS base
        WORKDIR /home/site/wwwroot
        EXPOSE 80
        EXPOSE 443

        FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
        ARG BUILD_CONFIGURATION=Release
        WORKDIR /src
        COPY ["function/${projectName}.csproj", "function/"]
        RUN dotnet restore "./function/${projectName}.csproj"
        COPY . .
        WORKDIR "/src/function"
        RUN dotnet build "./function/${projectName}.csproj" -c $BUILD_CONFIGURATION -o /app/build

        FROM build AS publish
        ARG BUILD_CONFIGURATION=Release
        RUN dotnet publish "./${projectName}.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

        FROM base AS final
        WORKDIR /home/site/wwwroot
        COPY --from=publish /app/publish .
        ENV AzureWebJobsScriptRoot=/home/site/wwwroot AzureFunctionsJobHost__Logging__Console__IsEnabled=true
    `
    }
    </File>;
  }
}