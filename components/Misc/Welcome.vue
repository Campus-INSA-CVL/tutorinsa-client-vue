<template lang="pug">
  div
    text-app(justify).
     TutorINSA aide les étudiants sur l'ensemble des matières proposées par l'INSA Centre-Val de Loire. Des tuteurs bénévoles donnent de leur temps pour permettre de #[span.font-weight-bold s'améliorer], de #[span.font-weight-bold travailler une notion] ou #[span.font-weight-bold préparer un examen].

    text-app(justify).
     Vous retrouverez sur ce site l'ensemble des #[span.font-weight-bold  offres] de tuteurs, prêts à donner des cours, et l'ensemble des #[span.font-weight-bold  demandes] des élèves qui souhaitent un cours d'un tuteur.

    text-app(center).font-weight-bold.
      #[span.text-capitalize élèves ? ]#[span.text-capitalize Tuteurs ? ] #[nuxt-link(to="/signup").text-capitalize.primary--tex rejoins nous !]

</template>

<script>
import TextApp from '@/components/Misc/Text'

export default {
  name: 'Welcome',
  components: {
    'text-app': TextApp
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
