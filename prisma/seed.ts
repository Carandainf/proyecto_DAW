import "dotenv/config";
import process from "process";

import { prisma } from '../src/lib/prisma';

async function main() {
    // Crear Rol de Administrador
    await prisma.role.upsert({
        where: { nombre: 'admin' },
        update: {},
        create: {
            nombre: 'admin',
            descripcion: 'Control total del laboratorio dental',
        },
    })

    // Crear Rol de Cliente
    await prisma.role.upsert({
        where: { nombre: 'user' },
        update: {},
        create: {
            nombre: 'user',
            descripcion: 'Cliente que sube trabajos y recibe mensajes',
        },
    })

    console.log('✅ Roles iniciales creados correctamente')
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })