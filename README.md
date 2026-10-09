# Comparateur de modération des vitesses

Outil web destiné aux communes. Il compare neuf aménagements de modération de la vitesse au droit d'un passage piéton, sous le même trafic, et désigne la solution qui concilie le mieux trafic et sécurité des piétons.

Aménagements comparés à une référence sans aménagement : dos d’âne, ralentisseur trapézoïdal, plateau surélevé, coussins berlinois, rétrécissement avec îlot, chicane à deux voies, changement de revêtement, bandes rugueuses, feu piéton à la demande.

Toute la page tient dans `index.html` : aucun serveur, aucune compilation. La bibliothèque three.js, chargée depuis cdnjs, ne sert qu'aux vues 3D ; sans connexion, la page fonctionne sans elles.

## Ce que fait la page

- **Microsimulation.** Modèle de poursuite IDM pour les véhicules, modèle de traversée pour les piétons (créneau accepté, conducteur qui cède, piéton engagé). Toutes les bandes reçoivent exactement les mêmes véhicules et les mêmes piétons, aux mêmes instants.
- **Évaluation.** Moyenne de cinq simulations d'une heure, avec des tirages fixés à l'avance.
- **Indicateurs.** V85 au passage, temps de parcours, débit écoulé, files d'attente, attente des piétons, part des conducteurs qui cèdent le passage, risque de décès pour un piéton qui surgit.
- **Solution recommandée.** Elle est choisie par une règle publiée sur la page, sans pondération :
  1. écouler la demande et respecter le cadre réglementaire ;
  2. retenir le risque de décès le plus faible, à 0,25 point près ;
  3. puis le temps perdu le plus faible ;
  4. puis l'attente piéton la plus courte.
- **Vues 3D.** Elles sont calculées à partir de la géométrie simulée. Un clic sur une vignette l'ouvre en 3840 × 2160 px, image téléchargeable.
- **Le lieu.** On pointe le passage sur une carte (plan OpenStreetMap ou satellite, recherche d'adresse). La page récupère la rue la plus proche (type, voies, sens unique, vitesse limite, largeur), les écoles et établissements de santé à moins de 400 m, les arrêts de bus, passages et feux voisins, et la densité de population (WorldPop 2020). Si une école borde la rue, elle propose de rapprocher le passage de l'école et liste les aménagements complémentaires.
- **Trafic sur la journée.** Profil horaire type ou comptages de la commune ; la journée est simulée de 5 h à 23 h pour chaque variante : heures de saturation, longueur des files, recommandations.
- **Note de calcul.** La commune choisit la variante retenue ; la page produit une note imprimable (français ou arabe) : résumé pour les élus, résultats expliqués, conditions d'utilisation vérifiées, plan de principe coté au format A4 paysage, implantation, visibilité, signalisation, éclairage, trottoirs, entretien, coût sommaire en dinars et en euros, plan d'action P1/P2/P3 et annexes techniques. Les prix unitaires et le taux de change sont modifiables.
- **Deux langues.** Français et arabe, avec la mise en page de droite à gauche.
- **Mode présentation.** Toutes les bandes tiennent sur un seul écran, pour le partage d'écran ou l'enregistrement vidéo.

Adresses directes :

- `…/#presentation` : mode présentation ;
- `…/#ar` : arabe ;
- `…/#presentation-ar` : les deux.

## Ce que la commune peut modifier, et ce qui est verrouillé

| Bloc | Contenu | Modifiable |
|---|---|---|
| Données du site | débit par sens, part de PL et bus, V85 mesurée en circulation libre, piétons à l'heure de pointe, largeur de voie | oui, dans des bornes |
| Choix de conception | largeurs du rétrécissement et de l'îlot, décalage, transition et largeur de voie de la chicane | oui, dans des bornes |
| Calibrage du modèle | comportement des conducteurs et des piétons, vitesses de franchissement des ralentisseurs, effet du rétrécissement, du revêtement et des bandes rugueuses, courbe de risque, tirages | non : verrouillé |

Un code de contrôle du calibrage (6 caractères) s’affiche sous la synthèse. Si quelqu'un déverrouille le calibrage (mode expert) et le modifie, la page l'affiche en rouge sur les résultats.

Le code de contrôle rend une modification visible, elle ne l'empêche pas : le fichier est public et peut être copié puis modifié. La référence fait donc foi seulement si elle est publiée à une adresse officielle, avec son code de contrôle.

## Avant toute diffusion aux communes

Le calibrage livré contient des ordres de grandeur, pas des mesures locales. L'administration qui diffuse l'outil doit d'abord :

1. **Caler les vitesses de franchissement** des ralentisseurs, plateaux, coussins, rétrécissements, revêtements et bandes rugueuses, à partir de mesures radar sur des ouvrages existants. Ce sont les constantes `dosVL`, `dosPL`, `trapVL`, `trapPL`, `platVL`, `platPL`, `cousVL`, `cousPL`, `retPct`, `revPct` et `rugPct`, dans `DEFAULTS`.
2. **Caler la courbe de cession** (`y50`, `ySlope`) à partir de comptages aux passages piétons.
3. **Vérifier le temps intervéhiculaire** (`T`) par rapport aux débits de saturation observés.
4. **Publier le nouveau code de contrôle** affiché par la page.

## Fonctions serveur

Deux fonctions Cloudflare Pages relaient des services que le navigateur ne peut pas appeler de façon fiable :

- `functions/api/osm.js` : OpenStreetMap par l'API Overpass, en essayant plusieurs serveurs (souvent surchargés), avec un cache de 24 h ;
- `functions/api/pop.js` : population WorldPop 2020 dans un rayon de 300 m (le service WorldPop n'autorise pas les appels depuis un navigateur).

Ouverte en fichier local, la page appelle Overpass directement et n'affiche pas la densité de population.

## Publication sur Cloudflare Pages

Créer un projet Pages relié à ce dépôt, avec ces réglages :

- framework : aucun ;
- commande de build : vide ;
- répertoire de sortie : `/`.

La page est servie telle quelle.

## Sources

- Treiber M., Hennecke A., Helbing D. (2000). Congested traffic states in empirical observations and microscopic simulations. *Physical Review E* 62(2), 1805–1824.
- Rosén E., Sander U. (2009). Pedestrian fatality risk as a function of car impact speed. *Accident Analysis & Prevention* 41(3), 536–542.
- Transportation Research Board (2010). *NCHRP Report 672: Roundabouts, an Informational Guide*, 2nd ed.
- Décret n° 94-447 du 27 mai 1994 ; norme NF P 98-300.
- CERTU (2010). *Guide des coussins et plateaux*.
- Bertulis T., Dulaski D. M. (2014). Driver approach speed and its impact on driver yielding to pedestrian behavior. *Transportation Research Record* 2464.
