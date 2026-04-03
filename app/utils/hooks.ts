import { useMemo } from "react";
import { useAccessStore, useAppConfig } from "../store";
import { collectModelsWithDefaultModel } from "./model";
import { ServiceProvider } from "../constant";

function providerHasKey(
  accessStore: ReturnType<typeof useAccessStore>,
  providerName: string,
): boolean {
  switch (providerName) {
    case ServiceProvider.OpenAI:
      return !!accessStore.openaiApiKey;
    case ServiceProvider.Azure:
      return !!accessStore.azureApiKey;
    case ServiceProvider.Google:
      return !!accessStore.googleApiKey;
    case ServiceProvider.Anthropic:
      return !!accessStore.anthropicApiKey;
    case ServiceProvider.Baidu:
      return !!accessStore.baiduApiKey;
    case ServiceProvider.ByteDance:
      return !!accessStore.bytedanceApiKey;
    case ServiceProvider.Alibaba:
      return !!accessStore.alibabaApiKey;
    case ServiceProvider.Tencent:
      return !!accessStore.tencentSecretKey;
    case ServiceProvider.Moonshot:
      return !!accessStore.moonshotApiKey;
    case ServiceProvider.Stability:
      return !!accessStore.stabilityApiKey;
    case ServiceProvider.Iflytek:
      return !!accessStore.iflytekApiKey;
    case ServiceProvider.XAI:
      return !!accessStore.xaiApiKey;
    case ServiceProvider.ChatGLM:
      return !!accessStore.chatglmApiKey;
    case ServiceProvider.DeepSeek:
      return !!accessStore.deepseekApiKey;
    case ServiceProvider.SiliconFlow:
      return !!accessStore.siliconflowApiKey;
    case ServiceProvider["302.AI"]:
      return !!accessStore.ai302ApiKey;
    default:
      return false;
  }
}

export function useAllModels() {
  const accessStore = useAccessStore();
  const configStore = useAppConfig();
  const models = useMemo(() => {
    const all = collectModelsWithDefaultModel(
      configStore.models,
      [configStore.customModels, accessStore.customModels].join(","),
      accessStore.defaultModel,
    );

    // When the user has enabled custom config (their own API keys),
    // only show models for providers that have a key configured.
    // When using the default server config, show all available models.
    if (!accessStore.useCustomConfig) {
      return all;
    }

    return all.filter((m) => {
      const pName = m.provider?.providerName ?? "";
      return providerHasKey(accessStore, pName);
    });
  }, [
    accessStore.useCustomConfig,
    accessStore.openaiApiKey,
    accessStore.azureApiKey,
    accessStore.googleApiKey,
    accessStore.anthropicApiKey,
    accessStore.baiduApiKey,
    accessStore.bytedanceApiKey,
    accessStore.alibabaApiKey,
    accessStore.tencentSecretKey,
    accessStore.moonshotApiKey,
    accessStore.stabilityApiKey,
    accessStore.iflytekApiKey,
    accessStore.xaiApiKey,
    accessStore.chatglmApiKey,
    accessStore.deepseekApiKey,
    accessStore.siliconflowApiKey,
    accessStore.ai302ApiKey,
    accessStore.customModels,
    accessStore.defaultModel,
    configStore.customModels,
    configStore.models,
  ]);

  return models;
}
