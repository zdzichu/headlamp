import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import DetailsViewRenderMapper from '../../helpers/renderHelpers';
import { apiFactory, apiFactoryWithNamespace } from '../../lib/k8s/apiProxy';
import CRD, { KubeCRD } from '../../lib/k8s/crd';
import { timeAgo } from '../../lib/util';
import Loader from '../common/Loader';
import { ConditionsTable, MainInfoSection, PageGrid } from '../common/Resource';
import { ViewDialog } from '../common/Resource/EditorDialog';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

function getAPIForCRD(item: KubeCRD) {
  const group = item.spec.group;
  const version = item.spec.version;
  const name = item.spec.names.plural;

  if (item.spec.scope === 'Namespaced') {
    return apiFactoryWithNamespace(group, version, name);
  }
  return apiFactory(group, version, name);
}

const useStyle = makeStyles({
  link: {
    cursor: 'pointer',
  },
});

export default function CustomResourceDefinitionDetails() {
  const classes = useStyle();
  const { name } = useParams<{ name: string }>();
  const [item, setItem] = React.useState<CRD | null>(null);
  const [objToShow, setObjToShow] = React.useState<KubeCRD | null>(null);
  const [objects, setObjects] = React.useState<KubeCRD[]>([]);
  const { t } = useTranslation('glossary');

  CRD.useApiGet(setItem, name);

  React.useEffect(() => {
    let promise: Promise<any> | null = null;
    if (item) {
      promise = getAPIForCRD(item.jsonData).list(setObjects);
    }

    return function cleanup() {
      if (promise) {
        promise.then((cancellable: () => void) => cancellable());
      }
    };
  }, [item]);

  return !item ? (
    <Loader title={t('resource|Loading resource definition details')} />
  ) : (
    <PageGrid>
      <MainInfoSection
        resource={item}
        extraInfo={
          item && [
            {
              name: t('frequent|Group'),
              value: item.spec.group,
            },
            {
              name: t('Version'),
              value: item.spec.version,
            },
            {
              name: t('Scope'),
              value: item.spec.scope,
            },
            {
              name: t('Subresources'),
              value: item.spec.subresources && Object.keys(item.spec.subresources).join(' & '),
              hide: !item.spec.subresources,
            },
          ]
        }
      />
      <SectionBox title={t('crd|Accepted Names')}>
        <SimpleTable
          data={[item.spec.names]}
          columns={[
            {
              label: t('Plural'),
              datum: 'plural',
            },
            {
              label: t('Singular'),
              datum: 'singular',
            },
            {
              label: t('glossary|Kind'),
              datum: 'kind',
            },
            {
              label: t('List Kind'),
              datum: 'listKind',
            },
          ]}
        />
      </SectionBox>
      <SectionBox title={t('frequent|Versions')}>
        <SimpleTable
          data={item.spec.versions}
          columns={[
            {
              label: t('frequent|Name'),
              datum: 'name',
            },
            {
              label: t('Served'),
              getter: version => version.storage.toString(),
            },
            {
              label: t('Storage'),
              getter: version => version.storage.toString(),
            },
          ]}
        />
      </SectionBox>
      <SectionBox title={t('Conditions')}>
        <ConditionsTable resource={item.jsonData} showLastUpdate={false} />
      </SectionBox>
      <SectionBox title={t('Objects')}>
        <SimpleTable
          data={objects}
          columns={[
            {
              label: t('frequent|Name'),
              getter: obj => (
                <Link className={classes.link} onClick={() => setObjToShow(obj)}>
                  {obj.metadata.name}
                </Link>
              ),
            },
            {
              label: t('glossary|Namespace'),
              getter: obj => obj.metadata.namespace || '-',
            },
            {
              label: t('Created'),
              getter: obj => timeAgo(obj.metadata.creationTimestamp),
            },
          ]}
        />
      </SectionBox>
      <DetailsViewRenderMapper kind={item?.jsonData.kind} />
      <ViewDialog item={objToShow} open={!!objToShow} onClose={() => setObjToShow(null)} />
    </PageGrid>
  );
}
