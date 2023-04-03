<script setup lang="ts">
  import type { ISbStoryData } from '@storyblok/vue';

  const route = useRoute();
  const { locale, locales } = useI18n();
  let calculatedLocale = locale.value;

  const currentRoute = { ...route };
  locales.value.forEach((loc: string) => {
    const internalLoc = loc;
    if (currentRoute.path.startsWith(`/${internalLoc}`)) {
      calculatedLocale = internalLoc;
    }
  });
  currentRoute.path = currentRoute.path.replace(new RegExp(`^/${calculatedLocale}`, 'mg'), '');
  /* if (currentRoute.path.startsWith(localeString)) {
    currentRoute.path = currentRoute.path.slice(localeString.length);
  } */
  if (currentRoute.path === '/') {
    currentRoute.path = 'home';
  }
  currentRoute.path = currentRoute.path.replace(/(^\/+|\/+$)/mg, '');

  const isPreview = !!(currentRoute.query._storyblok && currentRoute.query._storyblok !== '');
  const version = isPreview ? 'draft' : 'published';

  const story = ref({} as ISbStoryData);
  try {
    await useAsyncStoryblok(currentRoute.path, {
      version,
      language: calculatedLocale,
      resolve_relations: 'popular-articles.articles',
    }).then((response) => {
      if (!response) { return; }
      story.value = response.value;
    });
  } catch (error) {
    console.log(error);
  }
</script>

<template>
  <StoryblokComponent v-if="story.content" :blok="story.content" />
</template>
