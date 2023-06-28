#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { writeFile } from "fs/promises";

console.log(`
░█████╗░██╗░░██╗░██████╗░  ░██████╗████████╗░█████╗░██████╗░███████╗  ░█████╗░██╗░░░░░██╗
██╔══██╗██║░░██║██╔═══██╗  ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔════╝  ██╔══██╗██║░░░░░██║
███████║███████║██║██╗██║  ╚█████╗░░░░██║░░░██║░░██║██████╔╝█████╗░░  ██║░░╚═╝██║░░░░░██║
██╔══██║██╔══██║╚██████╔╝  ░╚═══██╗░░░██║░░░██║░░██║██╔══██╗██╔══╝░░  ██║░░██╗██║░░░░░██║
██║░░██║██║░░██║░╚═██╔═╝░  ██████╔╝░░░██║░░░╚█████╔╝██║░░██║███████╗  ╚█████╔╝███████╗██║
╚═╝░░╚═╝╚═╝░░╚═╝░░░╚═╝░░░  ╚═════╝░░░░╚═╝░░░░╚════╝░╚═╝░░╚═╝╚══════╝  ░╚════╝░╚══════╝╚═╝`);

console.log(chalk.green("This cli tool will only be useful & documented only after the release of v1. Hence, CLI v0.99.9999"));
console.log(chalk.yellow("The above info won't appear after v1 of the AHQ Store is released"));

(async() => {
    /**
     * @type {{[key: string]: string}}
     */
    const answers = await inquirer.prompt(
        [
            {
                name: "How many apps will this workspace produce (max 5)?",
                default: 1,
                type: "number",
                validate: (i) => i >= 1 && i <= 5 ? true : "Invalid! Max 5"
            },
            {
                name: "What is your application id(s) (use ; to separate each id)",
                validate: (i) => i.length > 13 ? i.split(";").length > 5 ? "Max 5" : true : "Must have at least 1 id"
            },
            {
                name: "Add zip file(s) validation (file endsWith) (use ; to separate each key)",
                validate: (i) => i.length > 3 ? i.split(";").length > 5 ? "Max 5" : true : "Must be 3 chars long"
            },
            {
                name: "Add the file(s) that runs the app (use ; to separate each key)",
                validate: (i) => i.length > 1 ? i.split(";").length > 5 ? "Max 5" : true : "Must be 1 char long"
            }
        ]
    );

    /**
     * @type {{
     *  apps: {
     *      zip_ends_with: string,
     *      exec: string,
     *      metadata: {
     *          description: string,
     *          icon: string
     *      },
     *      uid: string
     *  }[]
     * }}
     */
    let object = {
        apps: []
    };

    Object.entries(answers).forEach(([k, v]) => {
        if (k == "How many apps will this workspace produce (max 5)?") {
            let i = v;

            while (i != 0) {
                object.apps.push({
                    zip_ends_with: "",
                    exec: "",
                    metadata: {
                        description: "",
                        icon: ""
                    },
                    uid: ""
                });
                i--;
            }
        } else
        //app id list
        if (k == "What is your application id(s) (use ; to separate each id)") {
            const ids = v.split(";");

            ids.forEach((v, i) => {
                object.apps[i].uid = v;
            });
        } else
        //app zip list
        if (k == "Add zip file(s) validation (file endsWith) (use ; to separate each key)") {
            const files = v.split(";");

            files.forEach((v, i) => {
                object.apps[i].zip_ends_with = v;
            });
        } else
        //app exec list
        if (k == "Add the file(s) that runs the app (use ; to separate each key)") {
            const exec = v.split(";");

            exec.forEach((v, i) => {
                object.apps[i].exec = v;
            });
        }
    });

    let string = JSON.stringify(object, null, 4);

    console.log(chalk.blue(string));

    await writeFile("./astore.json", string);

    console.log(chalk.green("Done!"));
    console.log(chalk.yellow("Do edit the astore.json file & fill up the metadata"));
    console.log(chalk.yellow("the icon metadata must be a web base64 uri version of the icon"));
    console.log(chalk.yellow("The Description metadata must be a string, max 32chars"));
})();