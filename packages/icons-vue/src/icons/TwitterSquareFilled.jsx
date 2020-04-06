// GENERATE BY ./scripts/generate.js
// DON NOT EDIT IT MANUALLY

import Icon from '../components/AntdIcon';
import TwitterSquareFilledSvg from '@ant-design/icons-svg/lib/asn/TwitterSquareFilled';

export default {
  name: 'IconTwitterSquareFilled',
  displayName: 'TwitterSquareFilled',
  functional: true,
  props: { ...Icon.props },
  render: (h, { data, children, props }) =>
    h(
      Icon,
      { ...data, props: { ...data.props, ...props, icon: TwitterSquareFilledSvg } },
      children,
    ),
};