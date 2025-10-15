export const diseaseInfo: { [key: string]: any } = {
  dog:{
    'Fungal_Infection': {
      description: 'Fungal infections (Mycosis) are diseases caused by fungi (yeast/mold)  that overgrow on the dog’s skin. Fungi are parasitic, spore-producing organisms that acquire nourishment from their host. Fungal infections can be acquired by inhalation, ingestion, or through openings in the skin, such as cuts or wounds.Fungal infections can arise in healthy animals, but some require the host to be weakened or have a compromised immune system due to factors such as captivity, poor diet, viral infections, cancer, or medications like steroids. Furthermore, extended use of antimicrobial or immunosuppressive drugs seems to increase the chance of certain fungal infections developing. The infection itself can be restricted to a specific site (localized) or involve the entire body (systemic or generalized).',
      readMore: 'https://www.msdvetmanual.com/dog-owners/disorders-affecting-multiple-body-systems-of-dogs/fungal-infections-in-dogs#Aspergillosis_v3208492', 
      tags: ['Fungal', 'Common', 'Treatable'],
      info: {
        'Symptoms': 'Redness, Inflammation, The skin around the paws, claws, neck, and other delicate places may be flaky, crusty, or scaly. The skin is thickened and has a rough, textured surface similar to elephant skin, Affected areas show hair loss, Notably foul and sticky discharge, primarily from the ears.',
        'Treatment': 'antifungal medication',
        'Severity Indication': 'Mild to Moderate',
        'Prevention Tips':'Regular grooming supports healthy skin and helps prevent yeast growth. Keep your dog clean and completely dry after baths or getting wet. Routinely clean their ears and trim paw hair to reduce moisture buildup, Frquent wash bedding and food bowls to minimize bacterial growth, prevent exposure to damp and humid enviroment',
        'Contagion Rate': 'Can be contagious',
        'Risk Factors':'Wounds or damaged skin, Poor Hygiene',
        'Additional Info':'If your dog is Pomeranians, They are at moderate to high risk for fungal skin infections due to their thick double coats, which can trap moisture and heat, especially in the Philippines warm climate. Poor airflow around the skin can lead to itching, hotspots, and secondary fungal growth if not managed.'
      },
    },
    'Healthy': {
      description: 'Healthy skin in pets is a sign of overall wellness, proper nutrition, and good hygiene. It serves as the first line of defense against environmental threats like allergens, parasites, and pathogens.',
      tags: ['Normal', 'Healthy', 'No treatment needed'],
      info: {
        'Symptoms': 'Even coat with no hair loss, no redness, scabs, or bumps, no foul odor, Normal behavior (no scratching, licking, biting skin)',
        'Treatment': 'Regular grooming',
        'Severity Indication': 'This is the baseline state of well-being',
        'Prevention Tips':'None',
        'Risk Factors':'None',
        'Contagion Rate': 'Healthy skin poses no risk of spreading any condition',
      },
    },
    'Demodicosis': {
      description: 'Sarcoptic mange (canine scabies) is a highly contagious skin disease in dogs caused by the mite Sarcoptes scabiei var. canis. These mites burrow into the dog’s skin to lay eggs, causing intense itching and skin irritation. It spreads easily through direct contact or shared items like blankets and brushes, and can also be transmitted to humans (zoonotic).',
      readMore:'https://www.msdvetmanual.com/integumentary-system/mange/mange-in-dogs-and-cats?query=demodicosis%20in%20dogs',
      tags: ['Parasitic', 'Requires treatment', 'Common'],
      info: {
        'Symptoms': 'Hair loss, Skin scaling, Papules (Bumps on the skin), Pigmentation of the skin, Thickening of the skin, Itchiness',
        'Treatment': 'Localized Demodectic mange - clears up on its own in 1-2 months usually with topical treatments, Generalized mange - Common miticidal treatments (e.g Ivermectin, Amitraz etc.)',
        'Severity Indication':'Mild to Severe',
        'Prevention Tips':'Environmental cleaning is not usually necessary, as demodex is not highly contagious. A monthly or quarterly miticidal preventative is recommended to protect against other mites, fleas, and ticks',
        'Contagion Rate': 'Low to Non-Contagious, Note: Demodicosis is NOT usually contagious in healthy pets. However, young or immunocompromised animals may be at higher risk if exposed to a high mite load.',
        'Risk Factors':'Stress or illness, Poor nutrition',
        'Additional Info':'if your dog is Chihuahuas, although having a shorter coat, can be prone to demodicosis (mange), particularly if their immune system is weakened. In the Philippine setting, stress, poor diet, or underlying illness can contribute to outbreaks of this parasitic skin condition. Symptoms like localized hair loss and red patches should be checked early.'
      },
    },
    'Ringworm': {
      description: 'Ringworm is a contagious fungal infection of the skin, hair, or claws in dogs, most commonly caused by Microsporum canis (a type of fungus found in cats) and, less frequently, by Microsporum gypseum (a soil-based fungus) and Trichophyton mentagrophytes (which affects both pets and humans). The infection spreads through direct contact with infected animals or contaminated objects like bedding, brushes, or furniture, with fungal spores from broken hairs being the primary source. Dogs with weaker immune systems, puppies, and breeds like Yorkshire Terriers are more prone to severe or widespread infection.',
      readMore:'https://www.msdvetmanual.com/dog-owners/skin-disorders-of-dogs/ringworm-dermatophytosis-in-dogs',
      tags: ['Fungal', 'Contagious', 'Zoonotic'],
      info: {
        'Symptoms': 'Circular areas of hair loss, Broken hair and a Poor hair coat, Dry, scaly skin or areas of excessive dandruff,Inflamed areas of skin, Darkened patches of skin, Itchiness, scratching, or excessive grooming',
        'Treatment': 'Medicated shampoos and dips, Topical Antifungal Creams or Ointments (Clotrimazole, Terbinafine), Oral antifungal medication for sever or long-term cases (e.g., Griseofulvin, Itraconazole etc.)',
        'Severity Indication': 'Moderate to Severe',
        'Prevention Tips':'Environmental Cleaning with diluted bleach to kill funal spores on surfaces and bedding, Isolate infected pets to prevent spread to other animals, Regular grooming and bathing to detect early signs of infection',
        'Contagion Rate': 'Highly contagious',
        'Risk Factors':'Young pets, Immunocompromised, Close contact with infected pets or humans',
        'Additional Info':'If your dog is Aspins, In the Philippines, Aspins (Asong Pinoy) are more prone to ringworm infections, especially those living in outdoor environments. Their frequent exposure to soil, contaminated surfaces, and other animals increases the likelihood of encountering fungal spores. Additionally, many Aspins receive less routine grooming and veterinary care, which can allow skin infections like ringworm to go unnoticed. Regular hygiene and early veterinary intervention are essential for prevention and treatment.'
      },
    },
    'Hypersensitivity': {
      description: 'Hypersensitivity also known as allergies in dogs occur when the immune system overreacts to normally harmless substances, leading to inflammation and irritation. Common forms include flea allergy dermatitis, atopic dermatitis (environmental allergies), and food allergies. A variety of irritants might impact your dog, resulting in itching. The constant itching and discomfort can leave your dog distressed and persistently scratching. Over time, this repeated scratching may lead to irritated, inflamed skin that becomes more susceptible to secondary infections.',
      readMore:'https://ph.iams.asia/dog/dog-articles/does-your-dog-have-allergies ',
      tags: ['Allergic', 'Chronic', 'Requires diagnosis'],
      info: {
        'Symptoms': 'Red, irritated or flakey skin, Sores, Hair Loss, Excessive scratching and licking, Chewing or biting the skin',
        'Treatment': 'Frequent baths with hypoallergenic shampoos help remove allergens like grass and pollen. Consistent flea control, including treating the environment (vacuuming and using insecticides), is crucial for flea-allergic dogs. Hypoallergenic diets with limited or specially processed proteins can also be effective; consult your vet for the best option and avoid flavored medications, treats, and human food during the trial',
        'Severity Indication': 'Moderate to Severe',
        'Prevention Tips':'Supply a high-quality, vet-approved dog food, avoiding soy, additives, and low-grade ingredients, as proteins are the usual trigger for food allergies, not grains. Add probiotics to support gut health and help regulate allergic responses through beneficial bacteria.',
        'Contagion Rate': 'Non-Contagious',
        'Risk Factors':'Certain breeds (e.g., Golden Retrievers, Bulldogs)',
      },
    },
    'Dermatitis': {
      description: 'Dermatitis is an immunologic disease caused by the injection of antigens from the salivary glands of fleas as they feed on the host animal. The primary clinical signs are pruritus and papulocrustous lesions distributed on the lower back, tailhead, and caudal and inner thighs in dogs or pruritis and papular dermatitis found on the face, neck, and back in cats.',
      readMore: 'https://www.merckvetmanual.com/integumentary-system/fleas-and-flea-allergy-dermatitis/flea-allergy-dermatitis-in-dogs-and-cats?query=dermatitis%20in%C2%A0dogs#Treatment-and-Control_v3278721', 
      tags: ['Inflammatory', 'Common', 'Treatable'],
      info: {
        'Symptoms': 'Hair loss, Itching, Crust, Redness to the skin, Prescence of fleas or flea dirt, Anemia and Lethargy',
        'Treatment': 'Flea Control- either topical treatments or oral treatments, Relieve Itching and Inflammation - Antihistamines, Corticosteroids, Oatmeal baths or medicated shampoos, Treating Skin Infections - Antibiotics or Antifungal Treatments ',
        'Severity Indication': 'Mild to Moderate',
        'Prevention Tips':'Environmental Flea Control, pray insecticides, Wash bedding weekly in hot water, Vacuum frequently, Long-Term Management - Use flea preventives all year round, regular grooming and bathing, boost immune health with a good diet and supplements (e.g., omega-3)',
        'Contagion Rate': 'Non-Contagious',
        'Risk Factors':'Poor hygiene, Certain breeds such as Bulldogs,Retrievers, and terriers are prone to atopic dermatitis',
        'Additional Info':'If your dog is Shih Tzus, Shih Tzus are highly susceptible to dermatitis due to their thick, long coats and prominent skin folds. In the humid climate of the Philippines, moisture can easily get trapped in these folds, creating a perfect environment for bacteria and irritants to thrive.'
      },
    },
  },
  cat:{
    'Flea Allergy': {
      description: 'Flea Allergy Dermatitis (FAD) is a common skin condition in cats caused by an allergic reaction to proteins found in flea saliva. Even a single flea bite can trigger intense itching and skin inflammation in sensitive cats. This allergic response leads to overgrooming, scratching, and the development of skin lesions. FAD is most common during warmer months when fleas are active but can occur year-round in indoor cats.',
      readMore:'https://www.merckvetmanual.com/integumentary-system/fleas-and-flea-allergy-dermatitis/flea-allergy-dermatitis-in-dogs-and-cats?query=dermatitis%20in%C2%A0dogs#Treatment-and-Control_v3278721',
      tags: ['Treatable', 'Contagious', 'Common'],
      info: {
        'Symptoms': 'Intense Itching and scratching, Scabs and small bumps, hair loss, Irritated or Inflamed Skin, Flea dirt (black specks) or fleas',
        'Treatment': 'Kill Existing Fleas such as Bravecto, NexGard, Relieve Itching and Inflammation - Corticosteroids and Antihistamines',
        'Severity Indication': 'Moderate to Severe',
        'Prevention Tips':'Monthly Flea Prevention, Regularly vacuum carpets, rugs, furniture, wash pet bedding frequently in hot water',
        'Contagion Rate': 'Mildy contagious',
        'Risk Factors':'Presence of fleas (even just 1–2 bites), Contact with untreated animals',
        'Additional Info':'If your cat is Persian, Moderate risk as Their dense coat hides fleas, making infestations harder to detect. Regular combing is crucial.'
      },
    },
    'Scabies': {
      description: 'Feline Scabies (Notoedric Mange) are different parasite from canine scabies, but the symptoms they cause are similar. This type of mange is caused by tiny parasites that burrow into the skin, leading to intense itching, flaking, hair loss, and inflammation. Mange is relatively rare in cats, which can make it harder for owners to identify early. However, it is highly contagious and can easily spread between animals, so prompt treatment of mites is essential',
      readMore:'https://www.petmd.com/cat/conditions/skin/scabies-in-cats',
      tags: ['Treatable', 'Parasite', 'Common'],
      info: {
        'Symptoms': 'Symptoms usually begin with crusty and itchy ear edges, Skin flaking, Heavy ear wax, Inflammation ',
        'Treatment': 'Selamectin (6 mg/kg, spot-on) is approved for treating sarcoptic mange in dogs, but not for cats due to the rarity of scabies in felines. Nonetheless, it has proven to be an effective treatment for scabies in cats.Moxidectin (1 mg/kg, spot-on, in imidacloprid-moxidectin formulation) effective but also not approved Ivermectin is one of the first treatments used for feline scabies and is still used today. It is usually given by injection every 1-2 weeks for a month and it requires vet’s assistance. Alternative topical option: Lime sulfur or amitraz (Mitaban®) dips at 7-day intervals.',
        'Severity Indication': 'Moderate to Severe',
        'Prevention Tips':'Maintain a clean environment, regularly clean and disinfect your cat’s bedding, toys, and living areas to reduce the risk of mites. If possible, keep your cat indoors and supervise outdoor time to limit your cat’s contact with infected cats.If you can, bring your cat for regular veterinary check ups to detect early signs of scabies or other skin conditions.',
        'Contagion Rate': 'Highly contagious',
        'Risk Factors':'Exposure to infected animals',
        'Additional Info':'If your cat is Siamese, These specific breed of cats are at moderate risk More prone if housed with infected cats or exposed to strays. Their short coat makes skin lesions easily visible.'
      },
    },
    'Ringworm': {
      description: 'Ringworm is a fungal infection of the skin, hair, or claws in cats, caused by dermatophytes—most commonly Microsporum canis. Despite the name, it is not caused by a worm. The fungus thrives on dead skin cells and can be transmitted through direct contact with infected animals or contaminated environments.',
      readMore:'https://www.msdvetmanual.com/cat-owners/skin-disorders-of-cats/ringworm-dermatophytosis-in-cats',
      tags: ['Fungal', 'Contagious', 'Zoonotic'],
      info: {
        'Symptoms': 'Symptoms usually begin with crusty and itchy ear edges, Skin flaking, Heavy ear wax, Inflammation ',
        'Treatment': 'Medicated shampoos and dips, Topical Antifungal Creams or Ointments (Clotrimazole, Terbinafine), Oral antifungal medication for sever or long-term cases (e.g., Griseofulvin, Itraconazole etc.)',
        'Severity Indication': 'Moderate to Severe',
        'Prevention Tips':'Environmental Cleaning with diluted bleach to kill funal spores on surfaces and bedding, Isolate infected pets to prevent spread to other animals, Regular grooming and bathing to detect early signs of infection',
        'Contagion Rate': 'Highly contagious',
        'Risk Factors':'Young pets, Immunocompromised, Close contact with infected pets or humans',
        'Additional Info':'If your cat is Aspins, Puspin (Pusang Pinoy) In the Philippines, are more prone to ringworm infections, especially those living in outdoor environments. Their frequent exposure to soil, contaminated surfaces, and other animals increases the likelihood of encountering fungal spores. Additionally, many Aspins receive less routine grooming and veterinary care, which can allow skin infections like ringworm to go unnoticed. Regular hygiene and early veterinary intervention are essential for prevention and treatment.'
      },
    },
    'Healthy': {
      description: 'Healthy skin in pets is a sign of overall wellness, proper nutrition, and good hygiene. It serves as the first line of defense against environmental threats like allergens, parasites, and pathogens.',
      tags: ['Normal', 'Healthy', 'No treatment needed'],
      info: {
        'Symptoms': 'Even coat with no hair loss, no redness, scabs, or bumps, no foul odor, Normal behavior (no scratching, licking, biting skin)',
        'Treatment': 'Regular grooming',
        'Severity Indication': 'This is the baseline state of well-being',
        'Prevention Tips':'None',
        'Risk Factors':'None',
        'Contagion Rate': 'Healthy skin poses no risk of spreading any condition',
      },
    },
  }
  };
  