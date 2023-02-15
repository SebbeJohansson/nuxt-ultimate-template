import StoryBlokClient from 'storyblok-js-client';

export default defineEventHandler((event) => {
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

  const slug = event.context.params?.slug;
  const query = getQuery(event);
  return storyblokApiInstance.get(`cdn/stories/${slug}`, query);
});
