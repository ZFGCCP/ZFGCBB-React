import { resourceCatalog } from "@/shared/catalogs/resourceCatalog";

export default function ResourcesShowcasePage() {
  return <CmsCatalogShowcase descriptor={resourceCatalog} />;
}
