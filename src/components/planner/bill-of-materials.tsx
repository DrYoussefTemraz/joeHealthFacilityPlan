import { assetCategoryLabels } from "@/components/labels";
import { formatCurrency } from "@/lib/format";
import type { BillOfMaterialsRow } from "@/lib/planner";

type BillOfMaterialsProps = {
  rows: BillOfMaterialsRow[];
};

export function BillOfMaterials({ rows }: BillOfMaterialsProps) {
  const totalCents = rows.reduce(
    (total, row) => total + row.extendedCostCents,
    0,
  );

  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Bill of materials
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every placed item, aggregated across the building.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {rows.length} {rows.length === 1 ? "line" : "lines"} ·{" "}
          <span className="font-semibold text-foreground">
            {formatCurrency(totalCents)}
          </span>
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-border bg-muted p-6 text-sm text-muted-foreground">
          The bill of materials is empty. Add rooms and equipment above to build
          it.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[46rem] border-collapse text-sm">
            <caption className="sr-only">
              Aggregated equipment and furniture list with quantities and costs
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className="p-4 text-left font-medium text-muted-foreground"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="p-4 text-left font-medium text-muted-foreground"
                >
                  Item
                </th>
                <th
                  scope="col"
                  className="p-4 text-right font-medium text-muted-foreground"
                >
                  Qty
                </th>
                <th
                  scope="col"
                  className="p-4 text-right font-medium text-muted-foreground"
                >
                  Rooms
                </th>
                <th
                  scope="col"
                  className="p-4 text-right font-medium text-muted-foreground"
                >
                  Unit cost
                </th>
                <th
                  scope="col"
                  className="p-4 text-right font-medium text-muted-foreground"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.asset.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="p-4 text-muted-foreground">
                    {assetCategoryLabels[row.asset.category]}
                  </td>
                  <th scope="row" className="p-4 text-left font-medium">
                    {row.asset.name}
                  </th>
                  <td className="p-4 text-right">{row.quantity}</td>
                  <td className="p-4 text-right text-muted-foreground">
                    {row.roomCount}
                  </td>
                  <td className="p-4 text-right text-muted-foreground">
                    {formatCurrency(row.asset.unitCostCents)}
                  </td>
                  <td className="p-4 text-right font-medium">
                    {formatCurrency(row.extendedCostCents)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border bg-muted/50">
                <th scope="row" colSpan={5} className="p-4 text-left">
                  Total estimated asset cost
                </th>
                <td className="p-4 text-right font-semibold">
                  {formatCurrency(totalCents)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </section>
  );
}
