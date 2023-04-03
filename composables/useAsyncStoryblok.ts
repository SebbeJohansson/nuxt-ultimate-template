import { useStoryblokBridge, useStoryblokApi } from '@storyblok/vue';
import type {
  ISbStoriesParams, StoryblokBridgeConfigV2, ISbStoryData, ISbError, ISbResult,
} from '@storyblok/vue';
import { stringify } from 'storyblok-js-client/source/helpers';

export const useCustomAsyncStoryblok = async (
  url: string,
  apiOptions: ISbStoriesParams = {},
  bridgeOptions: StoryblokBridgeConfigV2 = {},
) => {
  const uniqueKey = `${JSON.stringify(apiOptions)}${url}`;
  const story = useState<ISbStoryData>(`${uniqueKey}-state`, () => ({} as ISbStoryData));
  const storyblokApiInstance = useStoryblokApi();

  onMounted(() => {
    if (story.value && story.value.id) {
      useStoryblokBridge(
        story.value.id,
        evStory => (story.value = evStory),
        bridgeOptions,
      );
    }
  });

  // const { data, error } = await useAsyncData<ISbResult, ISbError>(
  //   `${uniqueKey}-asyncdata`,
  //   () => storyblokApiInstance.get(`cdn/stories/${url}`, apiOptions),
  // );
  console.log('route: ', `/api/storyblok/${url}?${stringify(apiOptions)}`);
  const { data, error } = await useAsyncData<ISbResult, ISbError>(
    `${uniqueKey}-asyncdata`,
    // () => $fetch(`/api/storyblok/${url}?${stringify(apiOptions)}`), // Obscured fetch proxy.
    () => storyblokApiInstance.get(`cdn/stories/${url}`, apiOptions), // standard storyblok fetch
  );

  console.log(error.value);
  console.log(error.value?.response?.status);

  if (error.value?.response && error.value?.response.status >= 400 && error.value?.response.status < 600) {
    throw createError({ statusCode: error.value?.response.status, statusMessage: error.value?.message?.message || 'generic error' });
  }

  story.value = data.value?.data.story;

  return story;
};
