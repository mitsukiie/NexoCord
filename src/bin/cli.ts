#!/usr/bin/env node

import { version } from "../../package.json";

import { create_program, register_fallback, run_program } from "../cli/runner";

import { register_command as register_create_command } from "../cli/commands/create.command";
import { register_command as register_dev_command } from "../cli/commands/dev.command";
import { register_command as register_build_command } from "../cli/commands/build.command";
import { register_command as register_start_command } from "../cli/commands/start.command";
import { register_command as register_doctor_command } from "../cli/commands/doctor.command";
import { register_command as register_info_command } from "../cli/commands/info.command";
import { register_command as register_init_command } from "../cli/commands/init.command";
import { register_command as register_update_command } from "../cli/commands/update.command";

const program = create_program(version);

register_create_command(program);
register_dev_command(program);
register_build_command(program);
register_start_command(program);

register_doctor_command(program);
register_info_command(program);
register_init_command(program);
register_update_command(program);

register_fallback(program);

const exit_code = await run_program(program);

process.exitCode = exit_code;
