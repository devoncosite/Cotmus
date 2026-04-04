import { useMemo } from "react";
import { useAccessStore, useAppConfig } from "../store";
import { collectModelsWithDefaultModel } from "./model";
import { ServiceProvider } from "../constant";

interface ProviderKeys {
  openaiApiKey: string;
  azureApiKey: string;
  googleApiKey: string;
  anthropicApiKey: string;
  baiduApiKey: string;
  bytedanceApiKey: string;
  alibabaApiKey: string;
  tencentSecretKey: string;
  moonshotApiKey: string;
  stabilityApiKey: string;
  iflytekApiKey: string;
  xaiApiKey: string;
  chatglmApiKey: string;
  deepseekApiKey: string;
  siliconflowApiKey: string;
  ai302ApiKey: string;
}

function providerHasKey(keys: ProviderKeys, providerName: string): boolean {
  switch (providerName) {
    case ServiceProvider.OpenAI:
      return !!keys.openaiApiKey;
    case ServiceProvider.Azure:
      return !!keys.azureApiKey;
    case ServiceProvider.Google:
      return !!keys.googleApiKey;
    case ServiceProvider.Anthropic:
      return !!keys.anthropicApiKey;
    case ServiceProvider.Baidu:
      return !!keys.baiduApiKey;
    case ServiceProvider.ByteDance:
      return !!keys.bytedanceApiKey;
    case ServiceProvider.Alibaba:
      return !!keys.alibabaApiKey;
    case ServiceProvider.Tencent:
      return !!keys.tencentSecretKey;
    case ServiceProvider.Moonshot:
      return !!keys.moonshotApiKey;
    case ServiceProvider.Stability:
      return !!keys.stabilityApiKey;
    case ServiceProvider.Iflytek:
      return !!keys.iflytekApiKey;
    case ServiceProvider.XAI:
      return !!keys.xaiApiKey;
    case ServiceProvider.ChatGLM:
      return !!keys.chatglmApiKey;
    case ServiceProvider.DeepSeek:
      return !!keys.deepseekApiKey;
    case ServiceProvider.SiliconFlow:
      return !!keys.siliconflowApiKey;
    case ServiceProvider["302.AI"]:
      return !!keys.ai302ApiKey;
    default:
      return false;
  }
}

export function useAllModels() {
  const accessStore = useAccessStore();
  const configStore = useAppConfig();

  const useCustomConfig = accessStore.useCustomConfig;
  const openaiApiKey = accessStore.openaiApiKey;
  const azureApiKey = accessStore.azureApiKey;
  const googleApiKey = accessStore.googleApiKey;
  const anthropicApiKey = accessStore.anthropicApiKey;
  const baiduApiKey = accessStore.baiduApiKey;
  const bytedanceApiKey = accessStore.bytedanceApiKey;
  const alibabaApiKey = accessStore.alibabaApiKey;
  const tencentSecretKey = accessStore.tencentSecretKey;
  const moonshotApiKey = accessStore.moonshotApiKey;
  const stabilityApiKey = accessStore.stabilityApiKey;
  const iflytekApiKey = accessStore.iflytekApiKey;
  const xaiApiKey = accessStore.xaiApiKey;
  const chatglmApiKey = accessStore.chatglmApiKey;
  const deepseekApiKey = accessStore.deepseekApiKey;
  const siliconflowApiKey = accessStore.siliconflowApiKey;
  const ai302ApiKey = accessStore.ai302ApiKey;

  const models = useMemo(() => {
    const all = collectModelsWithDefaultModel(
      configStore.models,
      [configStore.customModels, accessStore.customModels].join(","),
      accessStore.defaultModel,
    );

    // When the user has enabled custom config (their own API keys),
    // only show models for providers that have a key configured.
    // When using the default server config, show all available models.
    if (!useCustomConfig) {
      return all;
    }

    const keys: ProviderKeys = {
      openaiApiKey,
      azureApiKey,
      googleApiKey,
      anthropicApiKey,
      baiduApiKey,
      bytedanceApiKey,
      alibabaApiKey,
      tencentSecretKey,
      moonshotApiKey,
      stabilityApiKey,
      iflytekApiKey,
      xaiApiKey,
      chatglmApiKey,
      deepseekApiKey,
      siliconflowApiKey,
      ai302ApiKey,
    };

    return all.filter((m) => {
      const pName = m.provider?.providerName ?? "";
      return providerHasKey(keys, pName);
    });
  }, [
    useCustomConfig,
    openaiApiKey,
    azureApiKey,
    googleApiKey,
    anthropicApiKey,
    baiduApiKey,
    bytedanceApiKey,
    alibabaApiKey,
    tencentSecretKey,
    moonshotApiKey,
    stabilityApiKey,
    iflytekApiKey,
    xaiApiKey,
    chatglmApiKey,
    deepseekApiKey,
    siliconflowApiKey,
    ai302ApiKey,
    accessStore.customModels,
    accessStore.defaultModel,
    configStore.customModels,
    configStore.models,
  ]);

  return models;
}
