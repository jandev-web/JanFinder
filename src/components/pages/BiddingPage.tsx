'use client';
import { BiddingPlatform } from '../../components/BiddingPlatform';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SimpleHeader } from '@/components/navigation/SimpleHeader';
import OwnerSidebar from '@/components/navigation/OwnerSidebar';

interface BiddingPlatformProps {
  availableQuotes: any;
}

const OwnerBiddingPage = ({ availableQuotes }: BiddingPlatformProps) => {
    const router = useRouter();

    const handleBack = () => {
        router.push('/business/owner/dashboard');
    };

    const handleLogout = () => {
        router.push('/business/logging-out');
    };

    

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full">
                <OwnerSidebar
                    currentView='bidding'
                />
                <SidebarInset className="flex flex-col">
                    <SimpleHeader title={'Bidding Platform'} subtitle={'Bid on and Purchase Quotes'} />
                    <div className="flex-1 bg-gray-50">
                        <div className="min-h-screen">
                            <BiddingPlatform
                                availableQuotes={availableQuotes}
                            />
                        </div>
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
export default OwnerBiddingPage;
