import StoryBlokClient from 'storyblok-js-client';

let storyblokApiInstance = new StoryBlokClient({});
let boolean = false;

export default defineEventHandler((event) => {
  if (!boolean) {
    console.log('boolean is false which means we dont have a proper storyblok api instance');
    const runtimeConfig = useRuntimeConfig();
    const storyblokConfig = runtimeConfig.public.storyblok as any; // Since not everything exists properly typed.
    const storyblokApiToken = storyblokConfig?.accessToken;
    const storyblokApiOptions = storyblokConfig?.apiOptions;

    storyblokApiInstance = new StoryBlokClient(
      {
        ...storyblokApiOptions,
        accessToken: storyblokApiToken,
      },
    );
  } else {
    console.log('boolean is true which means we have a proper storyblok api instance');
  }
  boolean = true;

  const slug = event.context.params?.slug;
  const query = getQuery(event);
  return storyblokApiInstance.get(`cdn/stories/${slug}`, query);
});
