<template>
  <div>
    <client-only>
      <Suspense>
        <template #default>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </template>
        <template #fallback>Loading... </template>
      </Suspense>
    </client-only>
  </div>
</template>
