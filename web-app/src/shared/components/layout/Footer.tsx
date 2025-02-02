'use client';

export default function Footer() {
  return (
    <div className="container h-full">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="material-icons text-[14px] text-blue-600">code</span>
          <span>
            Built by{' '}
            <a
              href="https://github.com/ugarchance"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-500 transition-colors font-medium"
            >
              Ahmet Ugar & Hakan Yavuzaslanoğlu
            </a>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/ugarchance/task-pilot"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
          >
            <span className="material-icons text-[14px]">star</span>
            GitHub
          </a>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className="material-icons text-[14px] text-blue-600">copyright</span>
            2024 Task Pilot
          </div>
        </div>
      </div>
    </div>
  );
} 