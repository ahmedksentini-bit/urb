# Comparateur de modération des vitesses

Outil web destiné aux communes. Il compare neuf aménagements de modération de la vitesse au droit d'un passage piéton, sous le même trafic, et désigne la solution qui concilie le mieux trafic et sécurité des piétons.

Aménagements comparés à une référence sans aménagement : dos d’âne, ralentisseur trapézoïdal, plateau surélevé, coussins berlinois, rétrécissement avec îlot, chicane à deux voies, changement de revêtement, bandes rugueuses, feu piéton à la demande.

Toute la page tient dans `index.html` : aucun serveur, aucune compilation. La bibliothèque three.js, chargée depuis cdnjs, ne sert qu'aux vues 3D ; sans connexion, la page fonctionne sans elles.

## Ce que fait la page

- **Mode d'emploi.** En tête de page, une section repliable explique l'objectif de l'outil, ses étapes, les données nécessaires (comment les obtenir, indispensables ou non) et l'endroit où lire chaque résultat.
- **Profil en travers.** Un éditeur inspiré de Streetmix décrit la rue de façade à façade : trottoirs, avancées de trottoir, bandes plantées, poteaux d'éclairage, stationnement, voies de circulation, voies bus, bandes et pistes cyclables, terre-plein central, îlot refuge. Trois onglets :
  - **existant** : la rue telle qu'elle est, situation de référence de la simulation (sept modèles de rues tunisiennes servent de point de départ) ;
  - **projeté (section courante)** : la rue après travaux, hors du passage ; il reprend l'existant tant qu'on ne le modifie pas ;
  - **au droit du passage** : calculé à partir du projeté pour la variante choisie (avancées de trottoir à la place du stationnement, îlot refuge, largeur reprise sur les trottoirs jusqu'à 1,40 m, longueur de traversée en un ou deux temps, poteaux d'éclairage présents), puis modifiable ; on peut revenir au profil calculé.

  Chaque élément se règle (largeur, sens), se déplace (glisser-déposer ou flèches) ou se supprime ; un poteau d'éclairage se place seul au bord du trottoir, côté chaussée. La page contrôle les largeurs (trottoir libre de 1,40 m au minimum, voies de 2,75 à 3,50 m, îlot de 1,50 m, etc.) et l'éclairage du passage. La largeur de voie de l'existant peut être reportée dans les données de la simulation, et les largeurs du profil au passage (voie, îlot) dans les choix de conception du rétrécissement et de la chicane. Les trois profils figurent dans la note de calcul.
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
- **Trois langues.** Français, arabe (mise en page de droite à gauche) et anglais, au choix en haut de la page ; la note de calcul suit la langue choisie, avec les nombres au format de la langue (virgule ou point décimal).
- **Module « Carrefour ».** Le bouton « Carrefour », sous le titre, ouvre une aide au choix du type de carrefour urbain selon le guide Certu « Carrefours urbains » (2010) et l'IISR, 3e partie. La commune décrit le contexte (hiérarchie des voies, vitesses), la géométrie (branches, emprise, pente, visibilité), le trafic de pointe, les usagers et ses objectifs. Pour chacun des dix types (priorité à droite, cédez-le-passage, stop, mini-giratoire, giratoire compact, moyen ou grand, carrefour à feux, avec îlot central, PSGR), l'outil donne un avis (conseillé, possible, déconseillé, exclu), la capacité et toutes ses raisons, chacune rattachée à une page du guide : tableau hiérarchie × types (p. 63), limites de trafic (p. 64), créneau critique et attente sur la voie secondaire (p. 93), graphique « feux ou pas de feux » (p. 68), réserve de capacité des feux (p. 159), ordres de grandeur et équilibre des flux des giratoires (p. 66, 124), contre-indications. Le guide ne pondère pas ses critères : l'outil classe les types par une règle publiée sur la page et invite à comparer les deux ou trois premiers en concertation. Schéma de principe, aménagements associés (refuge, tourne-à-gauche, triangles de visibilité, dimensions, signalisation) et note de choix imprimable dans les trois langues. Le mode d'emploi en tête de page change avec le module.
- **Module « Chaussée ».** Le bouton « Chaussée » propose un **prédimensionnement** de la structure de chaussée (couches et épaisseurs) dans plusieurs matériaux, pour un public non spécialiste : chaussée de rue, giratoire, voie de bus, stationnement, piste cyclable ou trottoir. Données : trafic de poids lourds par jour et par sens (situations types ou comptage), durée de service, croissance, nature du sol ou indice CBR, drainage. Solution principale d'après le guide Cerema « Voirie urbaine » (2016) : enrobé BBSG sur grave-bitume GB3 lu sur l'abaque p. 213 (trafic cumulé en essieux de 13 t, plate-forme PF, qualité Q2 des chantiers urbains, giratoire +15 %). Variantes en matériaux tunisiens (catalogue DGPC 1984, à titre indicatif car conçu pour la rase campagne) ; pavés (8 cm sous 50 PL/j, étude au-delà), enduit (T5 seulement), béton (étude), structures de piste cyclable du guide (p. 296). Coupes de principe, liste des cas qui exigent une étude approfondie, note imprimable. L'avertissement « prédimensionnement indicatif, étude approfondie en cas de doute » figure sur la page et dans la note.
- **Enregistrer et ouvrir un projet.** « Enregistrer le projet » télécharge un fichier `.json` qui contient tout l'état utile (lieu et analyse, données, profils, journée, variante, prix, carrefour) ; « Ouvrir un projet » le recharge. À chaque enregistrement, une copie est aussi envoyée à la fonction `functions/api/projets.js`, qui la conserve avec l'adresse IP, le pays, la ville, la date et le navigateur ; la page en informe l'utilisateur sous les boutons.
- **Mode présentation.** Toutes les bandes tiennent sur un seul écran, pour le partage d'écran ou l'enregistrement vidéo.

Adresses directes :

- `…/#presentation` : mode présentation ;
- `…/#ar` : arabe ;
- `…/#en` : anglais ;
- `…/#presentation-ar`, `…/#presentation-en` : mode présentation dans la langue choisie.
- `…/#carrefour`, `…/#carrefour-ar`, `…/#carrefour-en` : module carrefour.
- `…/#chaussee`, `…/#chaussee-ar`, `…/#chaussee-en` : module chaussée.

## Mode d'emploi à tenir à jour

Le mode d’emploi affiché en tête de page vit dans `I18N.fr/ar/en.guideBody` (traversée piétonne), `JXT.fr/ar/en.guideBody` (module carrefour) et `PVT.fr/ar/en.guideBody` (module chaussée). Tout nouveau module doit l'y compléter, dans les trois langues et dans la même livraison : une étape, les données qu'il demande, l'endroit où il affiche ses résultats (page et note de calcul).

## Ce que la commune peut modifier, et ce qui est verrouillé

| Bloc | Contenu | Modifiable |
|---|---|---|
| Données du site | débit par sens, part de PL et bus, V85 mesurée en circulation libre, piétons à l'heure de pointe, largeur de voie | oui, dans des bornes |
| Profils en travers | existant, projeté et profil au droit du passage : éléments, largeurs, sens, largeur disponible de façade à façade | oui (enregistrés dans le navigateur) |
| Choix de conception | largeurs du rétrécissement et de l'îlot, décalage, transition et largeur de voie de la chicane | oui, dans des bornes |
| Calibrage du modèle | comportement des conducteurs et des piétons, vitesses de franchissement des ralentisseurs, effet du rétrécissement, du revêtement et des bandes rugueuses, courbe de risque, tirages | non : verrouillé |

Un code de contrôle du calibrage (6 caractères) s’affiche sous la synthèse. Si quelqu'un déverrouille le calibrage (mode expert) et le modifie, la page l'affiche en rouge sur les résultats.

Le code de contrôle rend une modification visible, il ne l'empêche pas : le fichier est public et peut être copié puis modifié. La référence fait donc foi seulement si elle est publiée à une adresse officielle, avec son code de contrôle.

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

## Archive des projets enregistrés (administrateur)

La fonction `functions/api/projets.js` garde une copie de chaque projet enregistré, avec l'adresse IP, le pays et la ville (données de Cloudflare), la date et le navigateur. La page `admin.html` les liste et permet de télécharger chaque copie.

Mise en place, une seule fois, dans le tableau de bord Cloudflare :

1. **Workers et Pages → KV** : créer un espace de noms, par exemple `urb-projets`.
2. **Projet Pages → Paramètres → Liaisons** : ajouter une liaison KV nommée **`URB_PROJETS`** vers cet espace.
3. **Projet Pages → Paramètres → Variables et secrets** : ajouter un secret **`ADMIN_KEY`** (une phrase longue et difficile à deviner).
4. Redéployer (un nouveau push suffit).

Ensuite, `https://urbain.ksr-infra.org/admin.html` demande la clé et affiche les enregistrements. Sans liaison KV, la page enregistre toujours le fichier sur le poste de l'utilisateur et signale que la copie n'a pas pu être transmise.

L'adresse IP est une donnée personnelle (loi organique tunisienne n° 2004-63 ; RGPD pour les visiteurs européens) : la page l'annonce sous le bouton « Enregistrer le projet ». Conserver ces données le temps nécessaire au suivi des usages, puis les supprimer (les entrées KV peuvent être effacées depuis le tableau de bord). Une adresse IP désigne un accès réseau (parfois partagé par un opérateur mobile), pas une personne.
