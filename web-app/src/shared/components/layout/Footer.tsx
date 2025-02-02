'use client';

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{' '}
          <a
            href="https://github.com/ugarchance"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Ahmet Ugar & Hakan Yavuzaslanoğlu
          </a>
          . The source code is available on{' '}
          <a
            href="https://github.com/ugarchance/task-pilot"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
} 