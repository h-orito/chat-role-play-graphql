import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: '../graphql/schema.graphqls',
  documents: ['src/components/graphql/**/*.graphql', 'src/pages/**/*.tsx'],
  generates: {
    'src/lib/generated/': {
      preset: 'client',
      plugins: []
    },
    '../graphql/schema.json': {
      plugins: ['introspection']
    }
  }
}

export default config
