import { SectionBox } from '../components/common';
import { useTypedSelector } from '../redux/reducers/reducers';

export default function DetailsViewRenderMapper(props: { kind: string }) {
  const { kind } = props;
  const detailViews = useTypedSelector(state => state.ui.views.details.pluginAppendedDetailViews);
  return (
    <>
      {detailViews.map((item, index) => {
        if (item.resourceKind === kind) {
          return (
            <SectionBox title={item.sectionTitle} key={`${item.sectionTitle}__${index}`}>
              {<item.renderComponent />}
            </SectionBox>
          );
        }
        return null;
      })}
    </>
  );
}
