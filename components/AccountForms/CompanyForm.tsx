import { Tables } from "@/types/types_db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Company = Tables<'companies'>

const CompanyForm = ({ company }: { company: Company }) => {
return (
<div className="w-full max-w-3xl mx-auto mt-8">
  <div className="flex flex-row items-center space-x-4 pb-2">
    <Avatar className="w-16 h-16">
      <AvatarImage src={company.logo_url || undefined} alt={company.name} />
      <AvatarFallback>{company.name.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
    <div>
      <h2 className="text-2xl font-bold">{company.name}</h2>
      <Badge variant="outline" className="mt-1">{company.industry}</Badge>
    </div>
  </div>
  <div className="mt-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold text-sm text-muted-foreground">Website</h3>
        <p className="mt-1">{company.website_url || 'N/A'}</p>
      </div>
      <div>
        <h3 className="font-semibold text-sm text-muted-foreground">Location</h3>
        <p className="mt-1">{company.location || 'N/A'}</p>
      </div>
      <div className="col-span-2">
        <h3 className="font-semibold text-sm text-muted-foreground">Description</h3>
        <p className="mt-1">{company.description || 'No description available.'}</p>
      </div>
    </div>
  </div>
</div>
)
}

export default CompanyForm