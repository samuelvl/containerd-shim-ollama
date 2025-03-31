import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Flex,
  FlexItem,
  Label,
  Stack,
  StackItem,
  Icon,
  Split,
  SplitItem,
  CardFooter,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import BrandImage from '~/shared/components/BrandImage';
import { CatalogModel } from '~/app/concepts/modelCatalog/types';
import { modelDetailsUrlFromModel } from '~/app/pages/models/routeUtils';
import { getTagFromModel } from '~/app/pages/models/utils';
import { RhUiTagIcon } from '~/shared/images/icons';

export const ModelCatalogCard: React.FC<{ model: CatalogModel; source: string }> = ({
  model,
  source,
}) => (
  <Card isFullHeight>
    <CardHeader>
      <CardTitle>
        <Flex alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <BrandImage src={model.logo ?? ''} alt="" />
          </FlexItem>
          <FlexItem align={{ default: 'alignRight' }}>
            <Label>{source}</Label>
          </FlexItem>
        </Flex>
      </CardTitle>
    </CardHeader>
    <CardBody>
      <Stack hasGutter>
        <StackItem>
          <Link
            data-testid="model-catalog-detail-link"
            to={modelDetailsUrlFromModel(model, source) || '#'}
            style={{
              fontSize: 'var(--pf-t--global--font--size--body--default)',
              fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
            }}
          >
            {model.displayName}
          </Link>
          <Split hasGutter>
            <SplitItem>
              <Icon isInline>
                <RhUiTagIcon />
              </Icon>
              <span style={{ marginLeft: 'var(--pf-t--global--spacer--xs)' }}>
                {getTagFromModel(model)}
              </span>
            </SplitItem>
          </Split>
        </StackItem>
        <StackItem isFilled>{model.description}</StackItem>
      </Stack>
    </CardBody>
    <CardFooter>
      {(model.tasks ?? []).map((task, index) => (
        <Label variant="outline" key={index}>
          {task}
        </Label>
      ))}
    </CardFooter>
  </Card>
);
