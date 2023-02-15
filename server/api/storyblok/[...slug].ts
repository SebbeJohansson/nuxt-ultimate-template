import StoryBlokClient from 'storyblok-js-client';
import type {
  ISbError, ISbStory,
} from '@storyblok/vue';

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const storyblokConfig = runtimeConfig.public.storyblok as any; // Since not everything exists properly typed.
  const storyblokApiToken = storyblokConfig?.accessToken;
  const storyblokApiOptions = storyblokConfig?.apiOptions;

  const storyblokApiInstance = new StoryBlokClient(
    {
      ...storyblokApiOptions,
      accessToken: storyblokApiToken,
    },
  );

  // console.log(event);
  const slug = event.context.params?.slug;
  const query = getQuery(event);
  console.log(storyblokApiInstance);

  /* let story = {};
  await storyblokApiInstance.get(`cdn/stories/${slug}`, query).then((response) => {
    console.log('response:', response);
    const storyData = response as ISbStory;
    story = storyData?.data?.story;
  }).catch((error) => {
    const errorResponse = error.response as ISbError;
    if (errorResponse?.status >= 400 && errorResponse?.status < 600) {
      throw createError({ statusCode: errorResponse?.status, statusMessage: errorResponse?.response?.data?.[0] });
    }
  });

  return story; */
  return await storyblokApiInstance.get(`cdn/stories/${slug}`, query);
});
