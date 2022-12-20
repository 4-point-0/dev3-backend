import { DeployedContract } from '../entities/deployed-contract.entity';

export const mapDeployedContractDto = (entity: DeployedContract) => {
  return {
    uuid: entity.uuid,
    name: entity.contract_template.name,
    description: entity.contract_template.description,
    alias: entity.alias,
    tags: entity.tags,
    status: entity.status,
    args: entity.args,
    address: entity.address,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
};
