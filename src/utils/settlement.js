/**
 * Compute net balance per person: positive = owed money, negative = owes money.
 * Then simplify to minimal "from owes to amount" list.
 */
export function computeSettlement(candidates, entries) {
  const idToPerson = Object.fromEntries(candidates.map((c) => [c.id, c]))
  const nets = {}
  candidates.forEach((c) => (nets[c.id] = 0))

  entries.forEach((entry) => {
    const amount = Number(entry.amount) || 0
    const paidBy = entry.paidBy
    const splitAmong = entry.splitAmong || []
    if (!paidBy || splitAmong.length === 0) return

    nets[paidBy] += amount
    const share = amount / splitAmong.length
    splitAmong.forEach((id) => {
      nets[id] -= share
    })
  })

  const debtors = candidates
    .map((c) => ({ id: c.id, name: c.name, amount: -nets[c.id] }))
    .filter((d) => d.amount > 0.001)
    .sort((a, b) => b.amount - a.amount)

  const creditors = candidates
    .map((c) => ({ id: c.id, name: c.name, amount: nets[c.id] }))
    .filter((c) => c.amount > 0.001)
    .sort((a, b) => b.amount - a.amount)

  const result = []
  let i = 0
  let j = 0
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]
    const transfer = Math.min(debtor.amount, creditor.amount)
    if (transfer < 0.01) {
      if (debtor.amount < creditor.amount) i++
      else j++
      continue
    }
    result.push({
      fromId: debtor.id,
      fromName: debtor.name,
      toId: creditor.id,
      toName: creditor.name,
      amount: Math.round(transfer * 100) / 100,
    })
    debtor.amount -= transfer
    creditor.amount -= transfer
    if (debtor.amount < 0.01) i++
    if (creditor.amount < 0.01) j++
  }

  return { nets: nets, transfers: result, idToPerson }
}
