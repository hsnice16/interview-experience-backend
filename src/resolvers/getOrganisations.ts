import { Organisations } from "../db";
import { logger } from "../utils";
import { checkLimitValue, checkOffsetValue } from "./index";

export async function getOrganisations(args) {
  logger("-- getOrganisations : START --");

  checkLimitValue(args.limit);
  checkOffsetValue(args.offset);

  const organisations = await Organisations.get(args.limit, args.offset);

  logger("-- getOrganisations : END --");

  return organisations.map((organisation) => {
    const { _id, blogscount, name } = organisation;
    return { _id, name, blogCount: blogscount };
  });
}
