import React from 'react';
import { useParams } from 'react-router';
import {
  ActionList,
  Breadcrumb,
  BreadcrumbItem,
  Content,
  ContentVariants,
  Flex,
  FlexItem,
  Label,
  Stack,
  StackItem,
  ActionListGroup,
  Button,
  Skeleton,
  Popover,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { ModelCatalogContext } from '~/app/concepts/modelCatalog/context/ModelCatalogContext';
import { CatalogModel, CatalogModelDeploymentStatus } from '~/app/concepts/modelCatalog/types';
import ApplicationsPage from '~/shared/components/ApplicationsPage';
import { RhUiTagIcon } from '~/shared/images/icons';
import { ProjectObjectType, typedEmptyImage } from '~/shared/components/design/utils';
import PopoverListContent from '~/shared/components/PopoverListContent';
import ModelDetailsView from './ModelDetailsView';
import EmptyModelCatalogState from '../EmptyModelCatalogState';
import { decodeParams, findModelFromModelCatalogSources, getTagFromModel } from '../utils';
import { ModelDetailsRouteParams } from '../const';
import SimpleChat from '../../chat/screens/simple/SimpleChatbot';

const ModelDetailsPage: React.FC = () => {
  const params = useParams<ModelDetailsRouteParams>();
  const [isVisible, setIsVisible] = React.useState(false);
  // const navigate = useNavigate();
  const { modelCatalogSources } = React.useContext(ModelCatalogContext);
  const decodedParams = decodeParams(params);
  const { loaded } = modelCatalogSources;

  const model: CatalogModel | null = React.useMemo(
    () =>
      findModelFromModelCatalogSources(
        modelCatalogSources.data,
        decodedParams.sourceName,
        decodedParams.repositoryName,
        decodedParams.modelName,
        decodedParams.tag,
      ),
    [modelCatalogSources, decodedParams],
  );

  const deployModelButton = (
    <Button
      variant="primary"
      data-testid="deploy-model-button"
      onClick={() =>
        // TODO: Implement the model registration logic
        console.log('Registering model:', model)
      }
    >
      Deploy model
    </Button>
  );

  const removeModelButton = (
    <Button
      variant="danger"
      data-testid="remove-model-button"
      onClick={() =>
        // TODO: Implement the model registration logic
        console.log('Remove model:', model)
      }
    >
      Remove model
    </Button>
  );

  const chatButton =
    model?.status === CatalogModelDeploymentStatus.PENDING ? (
      <Popover
        headerContent="Deployment in progress"
        triggerAction="hover"
        data-testid="model-deployment-popover"
        bodyContent={
          <PopoverListContent
            data-testid="Deployment-model-button-popover"
            leadText="Your model is being deployed. You can check the status in the Model Catalog."
            listHeading="Model deployment phases are"
            listItems={['Model retrieval', 'Container init', 'Runtime and server execution']}
          />
        }
      >
        <Button data-testid="chat-model-button" isAriaDisabled variant="primary">
          Chat
        </Button>
      </Popover>
    ) : (
      <Button
        variant="primary"
        data-testid="chat-model-button"
        onClick={() => setIsVisible((value) => !value)}
      >
        Chat
      </Button>
    );

  return (
    <>
      <ApplicationsPage
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/models">Models</Link>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{decodedParams.modelName}</BreadcrumbItem>
          </Breadcrumb>
        }
        title={
          <Flex
            spaceItems={{ default: 'spaceItemsMd' }}
            alignItems={{ default: 'alignItemsCenter' }}
          >
            {model?.logo ? (
              <img src={model.logo} alt="model logo" style={{ height: '40px', width: '40px' }} />
            ) : (
              <Skeleton
                shape="square"
                width="40px"
                height="40px"
                screenreaderText="Brand image loading"
              />
            )}
            <Stack>
              <StackItem>
                <Flex
                  spaceItems={{ default: 'spaceItemsSm' }}
                  alignItems={{ default: 'alignItemsCenter' }}
                >
                  <FlexItem>{model?.displayName}</FlexItem>
                  {model && (
                    <Label variant="outline" icon={<RhUiTagIcon />}>
                      {getTagFromModel(model)}
                    </Label>
                  )}
                </Flex>
              </StackItem>
              {model && (
                <StackItem>
                  <Content component={ContentVariants.small}>Provided by {model.provider}</Content>
                </StackItem>
              )}
            </Stack>
          </Flex>
        }
        empty={model === null}
        emptyStatePage={
          <EmptyModelCatalogState
            testid="empty-model-catalog-state"
            title="Model Details not found"
            description="Check your configuration or try again later."
            headerIcon={() => (
              <img src={typedEmptyImage(ProjectObjectType.registeredModels)} alt="" />
            )}
          />
        }
        loadError={modelCatalogSources.error}
        loaded={loaded}
        errorMessage="Unable to load model catalog"
        provideChildrenPadding
        headerAction={
          loaded && (
            <ActionList>
              <ActionListGroup>
                {!model ? null : model.status === CatalogModelDeploymentStatus.UNDEPLOYED ? (
                  // For UNdeployed models - show Deploy button only
                  deployModelButton
                ) : model.status === CatalogModelDeploymentStatus.DEPLOYED ||
                  model.status === CatalogModelDeploymentStatus.PENDING ? (
                  // For pending and deployed models show deployment button
                  <>
                    {chatButton}
                    {removeModelButton}
                  </>
                ) : (
                  // For other statuses (like ERROR) - show only Deploy button
                  removeModelButton
                )}
              </ActionListGroup>
            </ActionList>
          )
        }
      >
        {model && <ModelDetailsView model={model} />}
      </ApplicationsPage>
      <SimpleChat isVisible={isVisible} model={model} />
    </>
  );
};

export default ModelDetailsPage;
