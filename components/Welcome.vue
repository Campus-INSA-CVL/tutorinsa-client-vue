<template lang="pug">
  div
    h1.display-1.text-center.
       #[span.text-capitalize bienvenue] sur #[span.text-uppercase t]#[span.text-lowercase utor]#[span.primary--text.font-weight-bold.text-uppercase insa]
    p.mx-6.mt-4.subtitle.text-justify.
     TutorINSA aide les étudiants sur l'ensemble des matières proposées par l'INSA Centre-Val de Loire. Des tuteurs bénévoles donnent de leur temps pour permettre de #[span.font-weight-bold s'améliorer], de #[span.font-weight-bold travailler une notion] ou #[span.font-weight-bold préparer un examen].

    p.mx-5.text-justify.
     Vous retrouverez sur ce site l'ensemble des #[span.font-weight-bold  offres] de tuteurs, prêts à donner des cours, et l'ensemble des #[span.font-weight-bold  demandes] des élèves qui souhaitent un cours d'un tuteur.

    p.mx-5.mb-0.text-center.subtitle-1.font-weight-bold.
      #[span.text-capitalize élèves ? ]#[span.text-capitalize Tuteurs ? ] #[nuxt-link(to="/signup").text-capitalize.primary--tex rejoins nous !]

</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
