export const Footer = () => {
    return (
      <footer className="border-t border-border bg-card mt-auto">
        <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg text-foreground">Ticket Manager</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your tickets efficiently
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Ticket Manager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };