import prisma from "../src/config/bdd";

// Actions disponibles par défaut pour le plugin Minecraft
const defaultActions = [
    {
        name: "MINE_BLOCK",
        description: "Miner un bloc spécifique",
        parameters: {
            block: {
                type: "string",
                description: "Identifiant du bloc (ex: diamond_ore, iron_ore, stone)",
                required: false,
            },
        },
    },
    {
        name: "KILL_MOBS",
        description: "Tuer des mobs (créatures)",
        parameters: {
            mob: {
                type: "string",
                description: "Type de mob (ex: zombie, skeleton, creeper, enderman)",
                required: false,
            },
        },
    },
    {
        name: "KILL_PLAYER",
        description: "Tuer un joueur en PvP",
        parameters: {
            player: {
                type: "string",
                description: "Nom du joueur cible (optionnel, tout joueur si non spécifié)",
                required: false,
            },
        },
    },
    {
        name: "PLACE_BLOCK",
        description: "Placer un bloc spécifique",
        parameters: {
            block: {
                type: "string",
                description: "Identifiant du bloc à placer (ex: cobblestone, oak_planks)",
                required: false,
            },
        },
    },
    {
        name: "BUILD_HOUSE",
        description: "Construire une maison (structure détectée par le plugin)",
        parameters: {
            minSize: {
                type: "number",
                description: "Taille minimale de la structure (en blocs)",
                required: false,
            },
            materials: {
                type: "array",
                description: "Liste des matériaux autorisés",
                required: false,
            },
        },
    },
    {
        name: "TRAVEL_TO",
        description: "Voyager vers une destination ou parcourir une distance",
        parameters: {
            destination: {
                type: "string",
                description: "Destination (ex: nether, end, coordinates)",
                required: false,
            },
            distance: {
                type: "number",
                description: "Distance en blocs à parcourir",
                required: false,
            },
        },
    },
    {
        name: "PLACE_FLAG",
        description: "Placer un drapeau (capture de zone, événement)",
        parameters: {
            zone: {
                type: "string",
                description: "Identifiant de la zone",
                required: false,
            },
            team: {
                type: "string",
                description: "Équipe du joueur",
                required: false,
            },
        },
    },
];

async function seed() {
    console.log(" Seeding default actions...\n");

    for (const action of defaultActions) {
        const existing = await prisma.actions.findUnique({
            where: { name: action.name },
        });

        if (existing) {
            console.log(`⏭  Action "${action.name}" already exists, skipping...`);
        } else {
            await prisma.actions.create({
                data: {
                    name: action.name,
                    description: action.description,
                    parameters: action.parameters,
                },
            });
            console.log(` Action "${action.name}" created`);
        }
    }

    console.log("\n Seed completed!");
}

seed()
    .catch((e) => {
        console.error(" Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
