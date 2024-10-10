﻿
import { File } from '@asyncapi/generator-react-sdk';
import crypto from 'crypto';

export default function serviceFunctionSolution({ asyncapi }) {

	const solutionName = asyncapi.info().title();
	const solutionguid = crypto.randomUUID();
	const projectName = solutionName; 
	const projectguid = crypto.randomUUID();

	return <File name={`${solutionName}.sln`}>
	{`
	
Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.9.34728.123
MinimumVisualStudioVersion = 10.0.40219.1
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "${projectName}", "function\\${projectName}.csproj", "{${projectguid}}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{${projectguid}}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{${projectguid}}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{${projectguid}}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{${projectguid}}.Release|Any CPU.Build.0 = Release|Any CPU
	EndGlobalSection
	GlobalSection(SolutionProperties) = preSolution
		HideSolutionNode = FALSE
	EndGlobalSection
	GlobalSection(ExtensibilityGlobals) = postSolution
		SolutionGuid = {${solutionguid}}
	EndGlobalSection
EndGlobal
	`
    }
  </File>;
}
