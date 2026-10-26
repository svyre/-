export function downloadCsv(name: string, rows: (string | number)[][]) {
  const safe = (v: string | number) => {
    let s = String(v);
    if (/^[=+@\-]/.test(s)) s = "'" + s;
    return '"' + s.replaceAll('"', '""') + '"';
  };
  const blob = new Blob(['\ufeff' + rows.map((r) => r.map(safe).join(';')).join('\r\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
